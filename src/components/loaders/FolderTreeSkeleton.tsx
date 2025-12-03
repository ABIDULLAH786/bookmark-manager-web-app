export const FolderTreeSkeleton = () => {
  // We create a mock structure to simulate the look of an open folder tree
  // 0 = root, 1 = nested child
  const mockStructure = [0, 0, 1, 1, 1, 0, 1, 0,0,0]; 

  return (
    <div className="w-full max-w-xs font-sans animate-pulse">
      {/* 1. Header Skeleton (All Bookmarks) */}
      <div className="mb-4 px-2">
        <div className="h-9 w-full rounded-md bg-slate-200 dark:bg-slate-800/60" />
      </div>

      {/* 2. List Skeleton */}
      <div className="space-y-0.5">
        {mockStructure.map((depth, i) => (
          <div 
            key={i} 
            className="flex items-center pr-3 py-1.5"
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            {/* Chevron Placeholder */}
            {/* <div className="mr-1 w-4 h-4 rounded-sm bg-slate-200 dark:bg-slate-800/60 shrink-0" /> */}
            
            {/* Icon Placeholder */}
            <div className="mr-2 w-4 h-4 rounded-sm bg-slate-200 dark:bg-slate-800/60 shrink-0" />
            
            {/* Text Label Placeholder (randomized widths) */}
            <div 
              className="h-4 rounded bg-slate-200 dark:bg-slate-800/60" 
              style={{ width: ['40%', '60%', '50%', '35%', '55%', '45%', '30%'][i] }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};