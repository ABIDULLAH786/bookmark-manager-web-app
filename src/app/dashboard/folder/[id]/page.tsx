import FolderPageClient from "@/components/PageComponents/folders/FolderPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap safely
  return <FolderPageClient id={id} />;
}
