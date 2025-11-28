import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import bookmarkModel from "@/models/bookmark.model";
import folderModel from "@/models/folder.model";

interface Params {
  params: { id: string };
}


export async function GET(req: Request, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;

  const bookmarks = await bookmarkModel.find({ parentFolder: id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data:bookmarks, message: "Bookmark Data fetched successfully" }, { status: 200 });

}

export async function POST(req: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const { id: parentFolderId } = params;
    const body = await req.json();

    // ✅ Validate required fields
    if (!body.title || !body.url) {
      return NextResponse.json(
        { message: "Title and URL are required" },
        { status: 400 }
      );
    }

    // ✅ Optional: check if parent folder exists
    const parentFolder = await folderModel.findById(parentFolderId);
    if (!parentFolder) {
      return NextResponse.json(
        { message: "Parent folder not found" },
        { status: 404 }
      );
    }

    // ✅ Create the bookmark
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

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;

  const data = await req.json();
  const updated = await bookmarkModel.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, data: updated, message: "Bookmark created successfully" }, { status: 200 });

}


export async function DELETE(req: Request, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;

  await connectToDatabase();
  await bookmarkModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Bookmark deleted successfully" }, { status: 200 });

}
