// src/hooks/useFolderNavigation.ts
"use client";

import { useRouter } from 'nextjs-toploader/app';

export function useFolderNavigation() {
  const router = useRouter();

  const goToFolder = (folderId: string | undefined) => {
    if(!folderId) return;
    router.push(`/dashboard/folder/${folderId}`);
  };

  return { goToFolder };
}
