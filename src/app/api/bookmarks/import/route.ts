import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ImportedItem } from "@/utils/bookmarkImport";
import FolderModel from "@/models/folder.model";
import BookmarkModel from "@/models/bookmark.model";
import { authOptions } from "@/lib/auth";

// Recursive function to save items to DB
async function saveTree(items: ImportedItem[], userId: string, parentId: string | null) {
  for (const item of items) {
    if (item.children) {
      // --- SAVE FOLDER ---
      const payload ={
        name: item.title,
        parentFolder: parentId,
        createdBy: userId,
        createdAt: item.addDate ? new Date(parseInt(item.addDate) * 1000) : new Date(),
      }
      console.log(`payload for ${item.title}  : `, payload);
      const newFolder = await FolderModel.create(payload);

      // Recurse into children, passing the new folder ID as parent
      if (item.children.length > 0) {
        await saveTree(item.children, userId, newFolder._id);
      }
    } else {
      // --- SAVE BOOKMARK ---
      await BookmarkModel.create({
        title: item.title,
        url: item.url,
        parentFolder: parentId, // Can be null if at root
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
    const { bookmarks } = body;

    if (!bookmarks || !Array.isArray(bookmarks)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Start saving from the root (parentId = null)
    await saveTree(bookmarks, userId, null);

    return NextResponse.json({ success: true, message: "Import completed" });

  } catch (err: any) {
    console.error("Import API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}