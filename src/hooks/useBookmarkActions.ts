"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { parseNetscapeHtml } from "@/utils/bookmarkImport";
import { useNotification } from "@/components/Notification";
import { API_PATHS } from "@/lib/apiPaths";
import { HTTP_METHOD } from "next/dist/server/web/http";
import { useSWRConfig } from "swr";

export function useBookmarkActions() {
  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname: ", pathname)
  const { mutate } = useSWRConfig()
  
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  // --- EXPORT LOGIC ---
  const handleExport = () => {
    // Trigger the browser download directly: /api/bookmarks/export
    const { url } = API_PATHS.BOOKMARKS.NESTED("/export").CREATE();
    window.location.href = url;
    showNotification("Export started...", "success");
  };

  // --- IMPORT LOGIC ---
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const parsedData = parseNetscapeHtml(text);

      if (parsedData.length === 0) {
        throw new Error("No bookmarks found in file.");
      }
      const { url: apiEndPoint, method } = API_PATHS.BOOKMARKS.NESTED("/import").CREATE();

      // const data = await fetcher([apiEndPoint, { method: method as HTTP_METHOD, body: { bookmarks: parsedData } }]);
      const res = await fetch(apiEndPoint, {
        method: method as HTTP_METHOD,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarks: parsedData }),
      });

      if (!res.ok) throw new Error("Failed to save bookmarks.");

      showNotification("Import successful!", "success");

      // Refresh Sidebar folders tree
      mutate([API_PATHS.FOLDERS.NESTED("/tree").LIST().url, {}]);

      // Refresh Dashboard Data (Only if on dashboard)
      if (pathname === "/dashboard") {
        mutate([API_PATHS.FOLDERS.LIST().url, {}]);
        mutate([API_PATHS.BOOKMARKS.LIST().url, {}]);
      }

      router.refresh();


    } catch (err: any) {
      console.error(err);
      showNotification(err.message || "Import failed", "error");
    } finally {
      setLoading(false);
      e.target.value = ""; // Reset input so same file can be selected again
    }
  };

  return {
    loading,
    handleExport,
    handleImport
  };
}