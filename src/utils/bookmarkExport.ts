// lib/bookmarkUtils.ts

interface TreeNode {
  type: "folder" | "bookmark";
  title: string;
  url?: string;
  addDate?: number;
  icon?: string;
  children: TreeNode[];
  hasBookmarksBar?: boolean; // This flag is crucial
}

export function buildBookmarkTree(flatFolders: any[], flatBookmarks: any[]): TreeNode[] {
  const folderMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // 1. Map Folders
  flatFolders.forEach((f) => {
    folderMap.set(f._id.toString(), {
      type: "folder",
      title: f.name,
      addDate: Math.floor(new Date(f.createdAt).getTime() / 1000),
      children: [],
      // ✅ Read the flag saved during the 'Dirty Import' scenario
      hasBookmarksBar: f.hasBookmarksBar || false, 
    });
  });

  // 2. Map Bookmarks to Parents
  flatBookmarks.forEach((b) => {
    const node: TreeNode = {
      type: "bookmark",
      title: b.title,
      url: b.url,
      addDate: Math.floor(new Date(b.createdAt).getTime() / 1000),
      icon: b.icon,
      children: [],
    };
    if (b.parentFolder && folderMap.has(b.parentFolder.toString())) {
      folderMap.get(b.parentFolder.toString())!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  // 3. Map Folders to Parents
  flatFolders.forEach((f) => {
    const node = folderMap.get(f._id.toString())!;
    if (f.parentFolder && folderMap.has(f.parentFolder.toString())) {
      folderMap.get(f.parentFolder.toString())!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export function generateNetscapeHTML(nodes: TreeNode[]): string {
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

  const buildHtmlRecursive = (items: TreeNode[], indent: string) => {
    let output = "";
    items.forEach((item) => {
      const date = item.addDate || Math.floor(Date.now() / 1000);

      if (item.type === "bookmark") {
        // --- BOOKMARK ---
        const iconAttr = item.icon ? ` ICON="${item.icon}"` : "";
        output += `${indent}<DT><A HREF="${item.url}" ADD_DATE="${date}"${iconAttr}>${item.title}</A>\n`;
      } else {
        // --- FOLDER ---
        output += `${indent}<DT><H3 ADD_DATE="${date}">${item.title}</H3>\n`;
        output += `${indent}<DL><p>\n`;

        // ✅ RE-WRAP LOGIC (Restored):
        // If this folder (e.g. "Imported") originally had a Bookmarks Bar, 
        // we recreate that structure here so the export matches the import.
        if (item.hasBookmarksBar) {
             // 1. Create the Inner Bookmarks bar Header
             // Note: We intentionally add PERSONAL_TOOLBAR_FOLDER="true" to match your source file
             output += `${indent}    <DT><H3 ADD_DATE="${date}" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>\n`;
             output += `${indent}    <DL><p>\n`;
             
             // 2. Put the children INSIDE this inner bar
             output += buildHtmlRecursive(item.children, indent + "        ");
             
             // 3. Close the Inner Bookmarks bar
             output += `${indent}    </DL><p>\n`;
        } else {
             // Standard folder: Render children directly
             output += buildHtmlRecursive(item.children, indent + "    ");
        }

        output += `${indent}</DL><p>\n`;
      }
    });
    return output;
  };

  // ✅ GLOBAL ROOT WRAPPER: 
  // This is the top-level "Bookmarks bar" that holds "Imported", "Imported (1)", etc.
  const now = Math.floor(Date.now() / 1000);
  html += `    <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>\n`;
  html += `    <DL><p>\n`;
  
  html += buildHtmlRecursive(nodes, "        ");

  html += `    </DL><p>\n`; // End Global Bar
  html += "</DL><p>";       // End Main DL
  return html;
}