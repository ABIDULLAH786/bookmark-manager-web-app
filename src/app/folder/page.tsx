import FoldersAndBookmarks from "@/components/PageComponents/FoldersAndBookmarks/FoldersAndBookmarks";

// fallback: showing the same landing page when user delibratly visit /folder or remove the id from folder/id
export default async function Page() {
  return<>
   <FoldersAndBookmarks />
  </>
}
