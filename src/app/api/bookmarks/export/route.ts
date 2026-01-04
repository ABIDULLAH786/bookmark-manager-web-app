// app/api/bookmarks/export/route.ts
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import folderModel from "@/models/folder.model";
import bookmarkModel from "@/models/bookmark.model";
import { authOptions } from "@/lib/auth";
import { buildBookmarkTree, generateNetscapeHTML } from "@/utils/bookmarkExport";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 1. Fetch EVERYTHING for this user (Efficient: Only 2 Queries)
    // .lean() is important for performance with large datasets
    const [folders, bookmarks] = await Promise.all([
      folderModel.find({ createdBy: userId }).lean(),
      bookmarkModel.find({ userId: userId }).lean(), // Assuming your schema uses 'userId' or 'createdBy'
    ]);

    // 2. Reconstruct the Tree
    const tree = buildBookmarkTree(folders, bookmarks);

    // 3. Generate HTML String
    const htmlContent = generateNetscapeHTML(tree);

    // 4. Return as Downloadable File
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="bookmarks_export_${new Date().toISOString().split('T')[0]}.html"`,
      },
    });

  } catch (err: any) {
    console.error("Export Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}