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

// /* -------------------- GET -------------------- */
// // Fetches all bookmarks inside a specific folder (ID = Folder ID)
// export async function GET(req: NextRequest, { params }: RouteParams) {
//   await connectToDatabase();
  
//   // 3. SECURITY: Authenticate
//   const session = await getServerSession(authOptions);
//   if (!session || !session.user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   const userId = (session.user as any).id;

//   const { id } = await params; 

//   // 4. FILTER: Get bookmarks in this folder THAT BELONG TO THIS USER
//   const bookmarks = await bookmarkModel
//     .find({ 
//       parentFolder: id, 
//       userId: userId // <--- Ownership Check
//     })
//     .sort({ createdAt: -1 });

//   return NextResponse.json(
//     { success: true, data: bookmarks, message: "Bookmark Data fetched successfully" },
//     { status: 200 }
//   );
// }

// /* -------------------- POST -------------------- */
// // Creates a bookmark inside a specific folder (ID = Folder ID)
// export async function POST(req: NextRequest, { params }: RouteParams) {
//   try {
//     await connectToDatabase();
    
//     // 5. SECURITY: Authenticate
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const userId = (session.user as any).id;

//     const { id: parentFolderId } = await params;
//     const body = await req.json();

//     if (!body.title || !body.url) {
//       return NextResponse.json({ message: "Title and URL are required" }, { status: 400 });
//     }

//     // 6. SECURITY: Check if Parent Folder exists AND belongs to user
//     const parentFolder = await folderModel.findOne({ 
//       _id: parentFolderId, 
//       createdBy: userId // <--- Critical Ownership Check
//     });

//     if (!parentFolder) {
//       return NextResponse.json({ message: "Parent folder not found or access denied" }, { status: 404 });
//     }

//     // 7. Create Bookmark linked to User
//     const newBookmark = await bookmarkModel.create({
//       title: body.title,
//       url: body.url,
//       description: body.description || "",
//       icon: body.icon || "🔗",
//       parentFolder: parentFolderId,
//       userId: userId, // <--- Force ID
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ success: true, data: newBookmark }, { status: 201 });

//   } catch (err: any) {
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((e: any) => e.message);
//       return apiError(400, "Validation failed", messages);
//     }
//     return apiError(500, err.message || "Internal Server error");
//   }
// }

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