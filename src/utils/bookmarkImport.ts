// lib/bookmarkImport.ts

export interface ImportedItem {
  title: string;
  url?: string;
  addDate?: string;
  icon?: string;
  children?: ImportedItem[];
  isSystemFolder?: boolean;
  // ✅ Add this field so we can pass it to the DB
  hasBookmarksBar?: boolean; 
}

export interface ParseResult {
  items: ImportedItem[];
  hasBookmarksBar: boolean;
}

export const parseNetscapeHtml = (html: string): ParseResult => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rootDl = doc.querySelector("dl");

  if (!rootDl) throw new Error("Invalid bookmark file format");

  const traverse = (dl: Element): ImportedItem[] => {
    const items: ImportedItem[] = [];
    const children = Array.from(dl.children);

    children.forEach((child) => {
      if (child.tagName === "DT") {
        const h3 = child.querySelector(":scope > h3");
        const subDl = child.querySelector(":scope > dl");
        const a = child.querySelector(":scope > a");

        if (h3 && subDl) {
          const isToolbarAttr = h3.getAttribute("PERSONAL_TOOLBAR_FOLDER") === "true";
          items.push({
            title: h3.textContent || "Untitled Folder",
            addDate: h3.getAttribute("add_date") || undefined,
            children: traverse(subDl),
            isSystemFolder: isToolbarAttr,
          });
        } else if (a) {
          items.push({
            title: a.textContent || "Untitled",
            url: a.getAttribute("href") || "#",
            addDate: a.getAttribute("add_date") || undefined,
            icon: a.getAttribute("icon") || undefined,
          });
        }
      }
    });
    return items;
  };

  const rawItems = traverse(rootDl);
  let globalHasBookmarksBar = false;

  const cleanTree = (nodes: ImportedItem[]): ImportedItem[] => {
    const cleanedNodes: ImportedItem[] = [];

    nodes.forEach((node) => {
      // 1. INSPECT CHILDREN BEFORE RECURSION
      // Check if any direct child is a Bookmarks Bar.
      // If so, THIS node (the parent) must own the flag.
      if (node.children && node.children.length > 0) {
         const hasBarChild = node.children.some(child => 
            child.isSystemFolder || 
            child.title?.trim().toLowerCase() === "bookmarks bar" || 
            child.title?.trim().toLowerCase() === "personal toolbar folder"
         );

         if (hasBarChild) {
             node.hasBookmarksBar = true; // ✅ Mark the parent folder
         }

         // Now recurse to clean/flatten the children
         node.children = cleanTree(node.children);
      }

      // 2. CHECK CURRENT NODE
      const title = node.title?.trim().toLowerCase();
      const isBookmarksBar =
        node.isSystemFolder ||
        title === "bookmarks bar" ||
        title === "personal toolbar folder";

      if (node.children && isBookmarksBar) {
        // Dissolve this folder, but track it globally for the root wrapper
        globalHasBookmarksBar = true;
        cleanedNodes.push(...node.children);
      } else {
        cleanedNodes.push(node);
      }
    });

    return cleanedNodes;
  };

  const finalItems = cleanTree(rawItems);

  return { items: finalItems, hasBookmarksBar: globalHasBookmarksBar };
};