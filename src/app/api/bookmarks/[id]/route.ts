import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bookmarkModel from "@/models/bookmark.model";
import folderModel from "@/models/folder.model";
import { apiError } from "@/lib/apiError";

// 1. UPDATE INTERFACE: params is now a Promise
export interface RouteParams {
  params: Promise<{ id: string }>;
}

/* -------------------- GET -------------------- */
export async function GET(req: NextRequest, { params }: RouteParams) {
  await connectToDatabase();
  
  // 2. AWAIT PARAMS HERE
  const { id } = await params; 

  const bookmarks = await bookmarkModel
    .find({ parentFolder: id })
    .sort({ createdAt: -1 });

  return NextResponse.json(
    { success: true, data: bookmarks, message: "Bookmark Data fetched successfully" },
    { status: 200 }
  );
}

/* -------------------- POST -------------------- */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    // 3. AWAIT PARAMS HERE
    const { id: parentFolderId } = await params;

    const body = await req.json();

    if (!body.title || !body.url) {
      return NextResponse.json(
        { message: "Title and URL are required" },
        { status: 400 }
      );
    }

    const parentFolder = await folderModel.findById(parentFolderId);
    if (!parentFolder) {
      return NextResponse.json(
        { message: "Parent folder not found" },
        { status: 404 }
      );
    }

    const newBookmark = await bookmarkModel.create({
      title: body.title,
      url: body.url,
      description: body.description || "",
      icon: body.icon || "🔗",
      parentFolder: parentFolderId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newBookmark }, { status: 201 });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return apiError(400, "Validation failed", messages);
    }
    return apiError(500, err.message || "Internal Server error");
  }
}

/* -------------------- PUT -------------------- */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  await connectToDatabase();
  
  // 4. AWAIT PARAMS HERE
  const { id } = await params; 

  const data = await req.json();
  const updated = await bookmarkModel.findByIdAndUpdate(id, data, { new: true });

  return NextResponse.json(
    { success: true, data: updated, message: "Bookmark updated successfully" },
    { status: 200 }
  );
}

/* -------------------- DELETE -------------------- */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  await connectToDatabase();
  
  // 5. AWAIT PARAMS HERE
  const { id } = await params; 

  await bookmarkModel.findByIdAndDelete(id);

  return NextResponse.json(
    { success: true, message: "Bookmark deleted successfully" },
    { status: 200 }
  );
}