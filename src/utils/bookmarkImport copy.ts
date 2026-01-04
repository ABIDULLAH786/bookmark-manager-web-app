// old code that is getting bookmark bar itself as well

export interface ImportedItem {
  title: string;
  url?: string;
  addDate?: string;
  icon?: string;
  children?: ImportedItem[]; // If it has children, it's a folder
}

export const parseNetscapeHtml = (html: string): ImportedItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rootDl = doc.querySelector("dl");

  if (!rootDl) throw new Error("Invalid bookmark file format");

  const traverse = (dl: Element): ImportedItem[] => {
    const items: ImportedItem[] = [];
    
    // Chrome nests items in <dt> tags
    const dts = Array.from(dl.children).filter(child => child.tagName === "DT");

    dts.forEach((dt) => {
      // 1. Check for FOLDER (H3 + DL)
      const h3 = dt.querySelector(":scope > h3");
      const subDl = dt.querySelector(":scope > dl");

      if (h3 && subDl) {
        items.push({
          title: h3.textContent || "Untitled Folder",
          addDate: h3.getAttribute("add_date") || undefined,
          children: traverse(subDl), // Recursively parse children
        });
      } 
      // 2. Check for BOOKMARK (A tag)
      else {
        const a = dt.querySelector(":scope > a");
        if (a) {
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

  return traverse(rootDl);
};