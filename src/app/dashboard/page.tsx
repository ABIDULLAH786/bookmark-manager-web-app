'use client';
import FoldersAndBookmarks from '@/components/PageComponents/FoldersAndBookmarks/FoldersAndBookmarks';
import { Suspense } from 'react';


function DashboardPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Dashboard />
  </Suspense>
}

export default function Dashboard() {

  return (
    <>
      <FoldersAndBookmarks />
    </>
  );
}