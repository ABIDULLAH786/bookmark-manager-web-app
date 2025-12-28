import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bookmarkModel from "@/models/bookmark.model";
import folderModel from "@/models/folder.model";
import { apiError } from "@/lib/apiError";
import { getServerSession } from "next-auth"; // 1. Import Session
import { authOptions } from "@/lib/auth";

// 1. UPDATE INTERFACE: params is now a Promise
export interface RouteParams {
  params: Promise<{ id: string }>;
}

/* -------------------- PATCH -------------------- */
// Updates a specific bookmark (ID = Bookmark ID)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  await connectToDatabase();
  
  // 8. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { id } = await params; 
  const data = await req.json();

  console.log("DataBeforeUpdate: ", data);

  // 9. SECURITY: Update only if bookmark exists AND belongs to User
  const updated = await bookmarkModel.findOneAndUpdate(
    { _id: id, userId: userId }, // <--- User Filter
    data, 
    { new: true }
  );
  
  if (!updated) {
     return NextResponse.json({ message: "Bookmark not found or unauthorized" }, { status: 404 });
  }

  console.log("updatedRes: ", updated);
  return NextResponse.json(
    { success: true, data: updated, message: "Bookmark updated successfully" },
    { status: 200 }
  );
}

/* -------------------- DELETE -------------------- */
// Deletes a specific bookmark (ID = Bookmark ID)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  await connectToDatabase();
  
  // 10. SECURITY: Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { id } = await params; 

  // 11. SECURITY: Delete only if bookmark belongs to User
  const deleted = await bookmarkModel.findOneAndDelete({ 
    _id: id, 
    userId: userId // <--- User Filter
  });

  if (!deleted) {
    return NextResponse.json({ message: "Bookmark not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json(
    { success: true, message: "Bookmark deleted successfully" },
    { status: 200 }
  );
}