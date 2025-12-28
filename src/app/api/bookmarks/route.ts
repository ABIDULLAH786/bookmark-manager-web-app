import { apiError } from "@/lib/apiError";
import { connectToDatabase } from "@/lib/db";
import bookmarkModel from "@/models/bookmark.model";
import folderModel from "@/models/folder.model"; // Import Folder model to check ownership
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // 1. Import session
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // SECURITY: Authenticate
    const session = await getServerSession(authOptions);
    console.log("ACTIVE_SESSION: ", session);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // FILTER: Only fetch root bookmarks (no folder) belonging to THIS user
    const bookmarks = await bookmarkModel
      .find({ 
        parentFolder: null, 
        createdBy: userId 
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: bookmarks, message: "Bookmarks Data fetched successfully" }, 
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

    // 2. SECURITY: If adding to a folder, verify USER OWNS that folder
    if (body.parentFolder) {
      const parentFolder = await folderModel.findOne({
        _id: body.parentFolder,
        createdBy: userId 
      });

      if (!parentFolder) {
        return apiError(404, "Parent folder not found or access denied");
      }
    }

    // 3. SECURITY: Force the 'userId' field to match the session
    const bookmarkData = {
      ...body,
      userId: userId, 
    };

    const bookmark = await bookmarkModel.create(bookmarkData);

    return NextResponse.json(
      { success: true, data: bookmark, message: "Bookmark created successfully" }, 
      { status: 201 }
    );

  } catch (err: any) {
    console.log("err.name: ", err.name);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message ?? e._message);
      console.log("NEW_MESSAGE:", messages);
      return apiError(400, "Validation failed", messages);
    }

    // Default fallback
    return apiError(500, err.message || "Internal Server error");
  }
}