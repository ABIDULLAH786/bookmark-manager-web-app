export const BookmarkGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {/* Responsive Logic:
        - Default: 3 cards (Indices 0, 1, 2)
        - md: 4 cards (Indices 0-3)
        - lg: 6 cards (Indices 0-5)
        - xl: 8 cards (Indices 0-7)
      */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className={`
            h-32 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-max p-4 space-y-3
            ${i < 3 ? 'block' : i < 4 ? 'hidden md:block' : i < 6 ? 'hidden lg:block' : 'hidden xl:block'}
          `}
        >
          {/* Top Row: Icon & Menu */}
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 bg-slate-100 dark:bg-slate-500/20 rounded-md" />
            <div className="h-4 w-4 bg-slate-100 dark:bg-slate-500/20 rounded-full" />
          </div>
          
          {/* Content Rows */}
          <div className="space-y-2 pt-1">
            {/* Title */}
            <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-500/20 rounded" />
            {/* Link URL */}
            <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-500/20 rounded" />
             {/* Description line (optional visually) */}
            <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-500/20 rounded mt-2 opacity-60" />
          </div>
        </div>
      ))}
    </div>
  );
};