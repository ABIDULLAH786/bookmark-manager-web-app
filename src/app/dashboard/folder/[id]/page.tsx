import FolderPageClient from "@/components/pages-clients/FolderPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap safely
  return <FolderPageClient id={id} />;
}
