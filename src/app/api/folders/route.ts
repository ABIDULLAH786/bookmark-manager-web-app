import { connectToDatabase } from "@/lib/db";
import Bookmark from "@/models/bookmark.model";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import folderModel from "@/models/folder.model";

export async function GET() {
  await connectToDatabase();

  // Get all root folders (no parent)
  const folders = await folderModel.find({ parentFolder: null }).sort({ createdAt: -1 }).lean();

  // Use Promise.all with map (not forEach)
  const formattedFolders = await Promise.all(
    folders.map(async (folder) => {
      // Find subfolders directly under this folder
      const subfolders = await folderModel.find({ parentFolder: folder._id }).lean();

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

        return NextResponse.json({ success: true, data:formattedFolders, message: "Folder Data fetched successfully" }, { status: 200 });

}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log({ ...body })
    const folder = await folderModel.create(body);
        return NextResponse.json({ success: true, data:folder, message: "Folder created successfully" }, { status: 200 });

  } catch (err: any) {
    console.error("Error creating folder:", err);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return apiError(400, "Validation failed", messages);
    }

    // Default fallback
    return apiError(500, err.message || "Internal Server error");
  }
}
