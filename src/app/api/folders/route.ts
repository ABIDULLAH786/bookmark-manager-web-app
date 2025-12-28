import { connectToDatabase } from "@/lib/db";
import Bookmark from "@/models/bookmark.model";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import folderModel from "@/models/folder.model";
import { getServerSession } from "next-auth"; // 1. Import this
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // 3. SECURITY: Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. SECURITY: Get the trustworthy ID from session
    // (Cast as any if TS complains, or use your custom types)
    const userId = (session.user as any).id;

    // 5. FILTER: Only find root folders belonging to THIS user
    const folders = await folderModel
      .find({ 
        parentFolder: null,
        createdBy: userId 
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedFolders = await Promise.all(
      folders.map(async (folder) => {
        // Filter subfolders for this user
        const subFolders = await folderModel.find({ 
          parentFolder: folder._id,
          createdBy: userId 
        }).lean();

        // Filter bookmarks for this user
        const bookmarks = await Bookmark.find({ 
          parentFolder: folder._id,
          userId: userId 
        }).lean();

        return {
          ...folder,
          subFolders,
          bookmarks,
          stats: {
            subFolders: subFolders.length,
            bookmarks: bookmarks.length,
            totalItems: subFolders.length + bookmarks.length,
          },
        };
      })
    );

    return NextResponse.json(
      { success: true, data: formattedFolders, message: "Folder Data fetched successfully" },
      { status: 200 }
    );

  } catch (err: any) {
    return apiError(500, err.message || "Internal Server error");
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 1. SECURITY: Authenticate
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const body = await req.json();

    // 2. SECURITY: Force the 'createdBy' field to match the session
    // We ignore whatever 'createdBy' user sent in the body
    const folderData = {
        ...body,
        createdBy: userId, 
    };

    console.log("Creating folder for user:", userId);

    const folder = await folderModel.create(folderData);
    
    return NextResponse.json(
        { success: true, data: folder, message: "Folder created successfully" }, 
        { status: 200 }
    );

  } catch (err: any) {
    console.error("Error creating folder:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return apiError(400, "Validation failed", messages);
    }

    return apiError(500, err.message || "Internal Server error");
  }
}