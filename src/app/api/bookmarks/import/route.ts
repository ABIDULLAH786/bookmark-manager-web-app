import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ImportedItem } from "@/utils/bookmarkImport";
import FolderModel from "@/models/folder.model";
import BookmarkModel from "@/models/bookmark.model";
import { authOptions } from "@/lib/auth";
// Recursive function to save items
async function saveTree(items: ImportedItem[], userId: string, parentId: string) {
  for (const item of items) {
    if (item.children) {
      // Create Folder
      const newFolder = await FolderModel.create({
        name: item.title,
        parentFolder: parentId,
        createdBy: userId,
        createdAt: item.addDate ? new Date(parseInt(item.addDate) * 1000) : new Date(),
        // We only mark the ROOT Imported folder as isImported usually, 
        // but you can add it here if you want subfolders marked too.
      });

      if (item.children.length > 0) {
        await saveTree(item.children, userId, newFolder._id);
      }
    } else {
      // Create Bookmark
      await BookmarkModel.create({
        title: item.title,
        url: item.url,
        parentFolder: parentId,
        createdBy: userId,
        icon: item.icon || "🔗",
        createdAt: item.addDate ? new Date(parseInt(item.addDate) * 1000) : new Date(),
      });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const body = await req.json();
    const { bookmarks } = body; // This is the flattened list from the helper

    if (!bookmarks || !Array.isArray(bookmarks)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // 1. DETERMINE FOLDER NAME (Imported, Imported (1), etc.)
    let folderName = "Imported";
    let counter = 0;
    
    // Check if "Imported" exists at the root (parentFolder: null)
    while (true) {
        const checkName = counter === 0 ? folderName : `${folderName} (${counter})`;
        const exists = await FolderModel.exists({ 
            name: checkName, 
            parentFolder: null, 
            createdBy: userId 
        });

        if (!exists) {
            folderName = checkName;
            break;
        }
        counter++;
    }

    // 2. CREATE THE ROOT "IMPORTED" FOLDER
    const rootImportFolder = await FolderModel.create({
        name: folderName,
        parentFolder: null, // It sits at root
        createdBy: userId,
        createdAt: new Date(),
        isImported: true // <--- Add this flag to your Schema to identify it later
    });

    // 3. SAVE CHILDREN INSIDE THIS NEW FOLDER
    await saveTree(bookmarks, userId, rootImportFolder._id);

    return NextResponse.json({ success: true, message: `Imported to "${folderName}"` });

  } catch (err: any) {
    console.error("Import API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}