// lib/bookmarkImport.ts

export interface ImportedItem {
  title: string;
  url?: string;
  addDate?: string;
  icon?: string;
  children?: ImportedItem[];
}

export const parseNetscapeHtml = (html: string): ImportedItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rootDl = doc.querySelector("dl");

  if (!rootDl) throw new Error("Invalid bookmark file format");

  const traverse = (dl: Element): ImportedItem[] => {
    const items: ImportedItem[] = [];
    const children = Array.from(dl.children);

    children.forEach((child) => {
      // Handle <DT> tags (Chrome style)
      if (child.tagName === "DT") {
        const h3 = child.querySelector(":scope > h3");
        const subDl = child.querySelector(":scope > dl");
        const a = child.querySelector(":scope > a");

        if (h3 && subDl) {
          // FOLDER
          items.push({
            title: h3.textContent || "Untitled Folder",
            addDate: h3.getAttribute("add_date") || undefined,
            children: traverse(subDl),
          });
        } else if (a) {
          // BOOKMARK
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

  // 1. Get the raw tree exactly as it is in the file
  const rawRootItems = traverse(rootDl);

  // 2. FLATTEN "Bookmarks bar"
  // If the file contains a top-level folder named "Bookmarks bar", 
  // we want its CONTENTS to be our root, not the folder itself.
  const finalItems: ImportedItem[] = [];

  rawRootItems.forEach(item => {
    // Check if it's the specific "Bookmarks bar" folder
    if (item.children && item.title.trim().toLowerCase() === "bookmarks bar") {
      // Spread its children into the root
      finalItems.push(...item.children);
    } else {
      // Keep other items (like "Other Bookmarks" or loose bookmarks) as is
      finalItems.push(item);
    }
  });

  return finalItems;
};