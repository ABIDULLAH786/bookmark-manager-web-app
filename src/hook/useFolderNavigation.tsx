// src/hooks/useFolderNavigation.ts
"use client";

import { useRouter } from "next/navigation";

export function useFolderNavigation() {
  const router = useRouter();

  const goToFolder = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  return { goToFolder };
}
