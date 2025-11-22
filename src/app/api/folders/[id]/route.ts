import { connectToDatabase } from "@/lib/db";
import Folder from "@/models/folder.model";
import Bookmark from "@/models/bookmark.model";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";

interface Params {
  params: { id: string };
}

// ✅ GET — Get folder details with subfolders, bookmarks, and counts
export async function GET(req: Request, { params }: Params) {
  await connectToDatabase();

  const { id } = await params;

  // Find the folder itself
  const folder = await Folder.findById(id).lean();
  if (!folder) {
    return NextResponse.json({ message: "Folder not found" }, { status: 404 });
  }

  // Find subfolders directly under this folder
  const subfolders = await Folder.find({ parentFolder: id }).lean();

  // Find bookmarks in this folder
  const bookmarks = await Bookmark.find({ parentFolder: id }).lean();

  const formattedSubFolders = await Promise.all(
    subfolders.map(async (folder) => {
      // Find subfolders directly under this folder
      const subfolders = await Folder.find({ parentFolder: folder._id }).lean();

      // Find bookmarks in this folder
      const bookmarks = await Bookmark.find({ parentFolder: folder._id }).lean();

      return {
        ...folder,
        subfolders,
        bookmarks,
        counts: {
          subfolders: subfolders.length,
          bookmarks: bookmarks.length,
          totalItems: subfolders.length + bookmarks.length,
        },
      };
    })
  );
  // Add counts
  const folderWithCounts = {
    ...folder,
    currentFolder: folder,
    subfolders: formattedSubFolders,
    bookmarks,
    counts: {
      subfolders: subfolders.length,
      bookmarks: bookmarks.length,
      totalItems: subfolders.length + bookmarks.length,
    },
  };

  return NextResponse.json(folderWithCounts);
}

export async function POST(req: Request, { params }: Params) {
  await connectToDatabase();

  try {
    const { id: parentFolderId } = params; // parent folder ID
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

    return NextResponse.json(newFolder, { status: 201 });
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

  const updated = await Folder.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

// ✅ DELETE — Delete folder
export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase();
  await Folder.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Folder deleted" });
}
