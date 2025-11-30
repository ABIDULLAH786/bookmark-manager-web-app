import { connectToDatabase } from "@/lib/db";
import Folder from "@/models/folder.model";
import Bookmark from "@/models/bookmark.model";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";

interface Params {
  params: Promise<{ id: string }>;
}


// Helper to exclude standard irrelevant fields
const EXCLUDE_FIELDS = "-__v -sharedWith -isFavoriteBy -createdBy";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { id } = await params;

  // 1. Find the Main Folder (Root)
  // We use .select() to remove fields not needed for the header
  const folder = await Folder.findById(id)
    .select(EXCLUDE_FIELDS) 
    .lean();

  if (!folder) {
    return NextResponse.json({ message: "Folder not found" }, { status: 404 });
  }

  // 2. Find Direct Bookmarks
  const bookmarks = await Bookmark.find({ parentFolder: id })
    .select(EXCLUDE_FIELDS)
    .lean();

  // 3. Find Direct Subfolders
  const subFolders = await Folder.find({ parentFolder: id })
    .select(EXCLUDE_FIELDS)
    .lean();

  // 4. Calculate Counts for the Subfolder Cards (Lightweight)
  // Instead of fetching the actual children arrays, we just COUNT them.
  // This drastically reduces payload size.
  const formattedSubFolders = await Promise.all(
    subFolders.map(async (sub) => {
      const subFolderCount = await Folder.countDocuments({ parentFolder: sub._id });
      const bookmarkCount = await Bookmark.countDocuments({ parentFolder: sub._id });

      return {
        ...sub,
        // Notice: We are NOT returning 'subFolders' or 'bookmarks' arrays here. 
        // Just the stats.
        stats: {
          subFolders: subFolderCount,
          bookmarks: bookmarkCount,
          totalItems: subFolderCount + bookmarkCount,
        },
      };
    })
  );

  // 5. Construct Final Response
  // We flatten the structure. No need for 'currentFolder' key.
  const responseData = {
    ...folder, // Spreads _id, name, description, etc.
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

export async function POST(req: Request, { params }: Params) {
  await connectToDatabase();

  try {
    const { id: parentFolderId } = await params; // parent folder ID
    const body = await req.json();

    // Validate name
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    // Check if parent exists (optional but recommended)
    const parentFolder = await Folder.findById(parentFolderId);
    if (!parentFolder) {
      return NextResponse.json(
        { message: "Parent folder not found" },
        { status: 404 }
      );
    }

    // Create the subfolder with reference to parent
    const newFolder = await Folder.create({
      name: body.name,
      description: body.description || "",
      parentFolder: parentFolderId, // ✅ link to parent
      createdAt: new Date(),
    });
      return NextResponse.json({ success: true, data:newFolder, message: "Folder created successfully" }, { status: 201 });

  } catch (err: any) {
    console.error("Error creating folder:", err);
    console.log("err.name: ", err.name)
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return apiError(400, "Validation failed", messages);
    }

    // Default fallback
    return apiError(500, err.message || "Internal Server error");
  }
}


// ✅ PUT — Update folder
export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase();
  const data = await req.json();
  const { id } = await params; 

  const updated = await Folder.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ success: true, data:updated, message: "Folder updated successfully" }, { status: 200 });

}

// ✅ DELETE — Delete folder
export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase();
  const { id } = await params; 
  await Folder.findByIdAndDelete(id);
  return NextResponse.json({ message: "Folder deleted" });
}
