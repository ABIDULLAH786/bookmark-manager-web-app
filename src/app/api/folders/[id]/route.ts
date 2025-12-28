import { connectToDatabase } from "@/lib/db";
import Folder from "@/models/folder.model";
import Bookmark from "@/models/bookmark.model";
import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import { getServerSession } from "next-auth"; // 1. Import Session
import { authOptions } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

// Helper to exclude standard irrelevant fields
const EXCLUDE_FIELDS = "-__v -sharedWith -isFavoriteBy -createdBy";

// ✅ GET — Fetch Folder (Secured)
export async function GET(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  
  // 1. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { id } = await params;

  // 2. Find Main Folder (Ensure ownership)
  const folder = await Folder.findOne({ _id: id, createdBy: userId }) // <--- User Filter
    .select(EXCLUDE_FIELDS)
    .lean();

  if (!folder) {
    return NextResponse.json({ message: "Folder not found" }, { status: 404 });
  }

  // 3. Find Direct Bookmarks (Belonging to this user)
  const bookmarks = await Bookmark.find({ parentFolder: id, userId: userId }) // <--- User Filter
    .select(EXCLUDE_FIELDS)
    .lean();

  // 4. Find Direct Subfolders (Belonging to this user)
  const subFolders = await Folder.find({ parentFolder: id, createdBy: userId }) // <--- User Filter
    .select(EXCLUDE_FIELDS)
    .lean();

  // 5. Calculate Counts (Scoped to User)
  const formattedSubFolders = await Promise.all(
    subFolders.map(async (sub) => {
      // Count only items created by this user
      const subFolderCount = await Folder.countDocuments({ 
        parentFolder: sub._id, 
        createdBy: userId 
      });
      const bookmarkCount = await Bookmark.countDocuments({ 
        parentFolder: sub._id, 
        userId: userId 
      });

      return {
        ...sub,
        stats: {
          subFolders: subFolderCount,
          bookmarks: bookmarkCount,
          totalItems: subFolderCount + bookmarkCount,
        },
      };
    })
  );

  const responseData = {
    ...folder,
    subFolders: formattedSubFolders,
    bookmarks,
    stats: {
      subFolders: subFolders.length,
      bookmarks: bookmarks.length,
      totalItems: subFolders.length + bookmarks.length,
    },
  };

  return NextResponse.json({ 
    success: true, 
    data: responseData, 
    message: "Folder Data fetched successfully" 
  }, { status: 200 });
}

// ✅ POST — Create Subfolder (Secured)
export async function POST(req: Request, { params }: Params) {
  await connectToDatabase();
  
  // 1. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const { id: parentFolderId } = await params; 
    const body = await req.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }

    // 2. SECURITY: Check if PARENT exists and belongs to USER
    const parentFolder = await Folder.findOne({ 
      _id: parentFolderId, 
      createdBy: userId // <--- Critical Check
    });

    if (!parentFolder) {
      return NextResponse.json({ message: "Parent folder not found or access denied" }, { status: 404 });
    }

    // 3. Create Subfolder (Force createdBy to match session)
    const newFolder = await Folder.create({
      name: body.name,
      description: body.description || "",
      parentFolder: parentFolderId,
      createdBy: userId, // <--- Force ID
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newFolder, message: "Folder created successfully" }, { status: 201 });

  } catch (err: any) {
    console.error("Error creating folder:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return apiError(400, "Validation failed", messages);
    }
    return apiError(500, err.message || "Internal Server error");
  }
}

// ✅ PATCH — Update folder (Secured)
export async function PATCH(req: Request, { params }: Params) {
  await connectToDatabase();
  
  // 1. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  
  const data = await req.json();
  const { id } = await params; 

  // 2. SECURITY: Update only if User owns it
  const updated = await Folder.findOneAndUpdate(
    { _id: id, createdBy: userId }, // <--- User Filter
    data, 
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Folder not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated, message: "Folder updated successfully" }, { status: 200 });
}

// ✅ DELETE — Delete folder (Secured)
export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase();
  
  // 1. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { id } = await params;

  try {
    // 2. SECURITY: Check existence & Ownership
    const folderExists = await Folder.findOne({ _id: id, createdBy: userId }); // <--- User Filter
    
    if (!folderExists) {
      return NextResponse.json({ message: "Folder not found or unauthorized" }, { status: 404 });
    }

    // 3. Run recursive cleanup
    // Pass userId to ensure we only clean up user's own data (double safety)
    await deleteFolderRecursively(id, userId);

    return NextResponse.json({ 
      success: true, 
      message: "Folder and all contents deleted successfully" 
    }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete folder" }, { status: 500 });
  }
}

// --- Helper: Recursive Delete Function (Secured) ---
const deleteFolderRecursively = async (folderId: string, userId: string) => {
  // 1. Find all direct sub-folders belonging to user
  const subFolders = await Folder.find({ parentFolder: folderId, createdBy: userId });

  // 2. Recursively delete
  for (const subFolder of subFolders) {
    await deleteFolderRecursively(subFolder._id.toString(), userId);
  }

  // 3. Delete bookmarks in this folder (Check userId for safety)
  await Bookmark.deleteMany({ parentFolder: folderId, userId: userId });

  // 4. Delete the folder itself
  await Folder.findOneAndDelete({ _id: folderId, createdBy: userId });
};