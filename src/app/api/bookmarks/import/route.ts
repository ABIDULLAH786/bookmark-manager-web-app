import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ImportedItem } from "@/utils/bookmarkImport";
import FolderModel from "@/models/folder.model";
import BookmarkModel from "@/models/bookmark.model";
import { authOptions } from "@/lib/auth";

async function saveTree(items: ImportedItem[], userId: string, parentId: string | null) {
  for (const item of items) {
    if (item.children) {
      const newFolder = await FolderModel.create({
        name: item.title,
        parentFolder: parentId,
        createdBy: userId,
        createdAt: item.addDate ? new Date(parseInt(item.addDate) * 1000) : new Date(),
        // ✅ FIX: Use the flag from the item, or default to false
        hasBookmarksBar: item.hasBookmarksBar || false 
      });

      if (item.children.length > 0) {
        await saveTree(item.children, userId, newFolder._id);
      }
    } else {
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
    const { bookmarks, hasBookmarksBar } = body; 

    if (!bookmarks || !Array.isArray(bookmarks)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // 1. CHECK IF ROOT IS EMPTY
    const rootFoldersCount = await FolderModel.countDocuments({ createdBy: userId, parentFolder: null });
    const rootBookmarksCount = await BookmarkModel.countDocuments({ createdBy: userId, parentFolder: null });
    
    const isRootEmpty = rootFoldersCount === 0 && rootBookmarksCount === 0;

    // --- SCENARIO 1: CLEAN IMPORT (No "Imported" folder needed) ---
    if (isRootEmpty) {
        await saveTree(bookmarks, userId, null);
        return NextResponse.json({ success: true, message: "Imported to root" });
    }

    // --- SCENARIO 2: DIRTY IMPORT (Wrap in "Imported") ---
    else {
        let folderName = "Imported";
        let counter = 0;
        
        // Find unique name (Imported, Imported (1)...)
        while (true) {
            const checkName = counter === 0 ? folderName : `${folderName} (${counter})`;
            const exists = await FolderModel.exists({ name: checkName, parentFolder: null, createdBy: userId });
            if (!exists) {
                folderName = checkName;
                break;
            }
            counter++;
        }

        // Create the Wrapper
        const rootImportFolder = await FolderModel.create({
            name: folderName,
            parentFolder: null,
            createdBy: userId,
            createdAt: new Date(),
            isImported: true,
            // ✅ THIS IS KEY: If the source had a bar, this wrapper now represents that bar.
            hasBookmarksBar: hasBookmarksBar || false 
        });

        await saveTree(bookmarks, userId, rootImportFolder._id);

        return NextResponse.json({ success: true, message: `Imported to "${folderName}"` });
    }

  } catch (err: any) {
    console.error("Import API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}