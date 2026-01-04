interface TreeNode {
  type: "folder" | "bookmark";
  title: string;
  url?: string;
  addDate?: number;
  icon?: string;
  children: TreeNode[];
}

export function buildBookmarkTree(flatFolders: any[], flatBookmarks: any[]): TreeNode[] {
    const folderMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];
  
    // 1. Initialize all folders in the Map
    flatFolders.forEach((f) => {
      folderMap.set(f._id.toString(), {
        type: "folder",
        title: f.name,
        addDate: Math.floor(new Date(f.createdAt).getTime() / 1000),
        children: [],
      });
    });
  
    // 2. Assign Bookmarks to their parents
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
  
    // 3. Assign Folders to their parents
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
  // 1. Standard Header
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

  // 2. Recursive Builder
  const buildHtmlRecursive = (items: TreeNode[], indent: string) => {
    let output = "";
    items.forEach((item) => {
      const date = item.addDate || Math.floor(Date.now() / 1000);
      
      if (item.type === "bookmark") {
        const iconAttr = item.icon ? ` ICON="${item.icon}"` : "";
        output += `${indent}<DT><A HREF="${item.url}" ADD_DATE="${date}"${iconAttr}>${item.title}</A>\n`;
      } else {
        output += `${indent}<DT><H3 ADD_DATE="${date}">${item.title}</H3>\n`;
        output += `${indent}<DL><p>\n`;
        output += buildHtmlRecursive(item.children, indent + "    ");
        output += `${indent}</DL><p>\n`;
      }
    });
    return output;
  };

  // 3. WRAPPER LOGIC: Wrap user root items inside "Bookmarks bar"
  const now = Math.floor(Date.now() / 1000);
  
  // Start wrapper
  html += `    <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>\n`;
  html += `    <DL><p>\n`;

  // Inject user content inside
  html += buildHtmlRecursive(nodes, "        ");

  // Close wrapper
  html += `    </DL><p>\n`;
  
  // Close main file
  html += "</DL><p>";
  
  return html;
}