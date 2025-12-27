import { NextResponse } from "next/server";
import mongoose from "mongoose";
import FolderModel from "@/models/folder.model";
import { USER_ID } from "@/constants";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// import { getServerSession } from "next-auth"; 

// Helper function to build tree from flat array
const buildFolderTree = (folders: any[]) => {
  const folderMap = new Map();
  const roots: any[] = [];

  // 1. Initialize all folders in a map
  folders.forEach((folder) => {
    // FIX: Removed .toObject() because .lean() returns plain objects already
    folderMap.set(folder._id.toString(), {
      ...folder,
      children: []
    });
  });

  // 2. Link children to parents
  folders.forEach((folder) => {
    const folderId = folder._id.toString();
    const mappedFolder = folderMap.get(folderId);

    if (folder.parentFolder) {
      const parentId = folder.parentFolder.toString();
      // Check if parent exists in the fetched set (it might not if we only fetched a subset or if parent is deleted)
      if (folderMap.has(parentId)) {
        folderMap.get(parentId).children.push(mappedFolder);
      } else {
        // If parent isn't found (orphan or root in this context), treat as root
        roots.push(mappedFolder);
      }
    } else {
      // If no parent, it is a root folder
      roots.push(mappedFolder);
    }
  });

  return roots;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    connectToDatabase();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // We cast as 'any' because default types might not show 'id' yet
    const userId = (session.user as any).id ?? USER_ID;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. OPTIMIZED FETCH: Get ALL folders for this user in ONE query.
    const allFolders = await FolderModel.find({
      createdBy: userId
    })
      .select("_id name parentFolder subFolders")
      .lean() // Returns plain JS objects (faster, but no .toObject() method)
      .exec();

    // 4. Construct the tree in memory
    const folderTree = buildFolderTree(allFolders);

    return NextResponse.json({ success: true, data: folderTree });

  } catch (error) {
    console.error("Folder Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}