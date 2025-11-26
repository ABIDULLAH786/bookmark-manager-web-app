import { connectToDatabase } from "@/lib/db";
import bookmarkModel from "@/models/bookmark.model";
import folderModel from "@/models/folder.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  // Get all root folders (no parent)
  const folders = await folderModel.find({ parentFolder: null }).sort({ createdAt: -1 }).lean();

  // Use Promise.all with map (not forEach)
  const formattedFolders = await Promise.all(
    folders.map(async (folder) => {
      // Find subfolders directly under this folder
      const subfolders = await folderModel.find({ parentFolder: folder._id }).lean();

      
      return {
        ...folder,
        subfolders,
       
      };
    })
  );

  return NextResponse.json(formattedFolders);
}