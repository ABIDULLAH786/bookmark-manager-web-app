import { apiError } from "@/lib/apiError";
import { connectToDatabase } from "@/lib/db";
import bookmarkModel from "@/models/bookmark.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const bookmarks = await bookmarkModel.find({ parentFolder: null }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data:bookmarks, message: "Bookmarks Data fetched successfully" }, { status: 200 });
  
}

export async function POST(req: Request) {
  try {

    await connectToDatabase();
    const data = await req.json();
    const bookmark = await bookmarkModel.create(data);
    return NextResponse.json({ success: true, data:bookmark, message: "Bookmark created successfully" }, { status: 201 });

  } catch (err: any) {
    console.log("err.name: ", err.name)
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message ?? e._message);
      console.log("NEW_MESSAGE:", messages)
      return apiError(400, "Validation failed", messages);
    }

    // Default fallback
    return apiError(500, err.message || "Internal Server error");
  }
}
