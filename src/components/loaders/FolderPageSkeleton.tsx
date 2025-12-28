import { Separator } from "../ui/separator";

export const PageMainAreaSkeleton = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] animate-pulse">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
           
           {/* 1. Header Skeleton */}
           <div className="md:flex flex-row items-center justify-between border-none mb-6">
              <div className="space-y-3 w-full max-w-lg">
                 {/* Title */}
                 <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
                 {/* Description */}
                 <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                 <div className="h-10 w-32 rounded-md bg-slate-200 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700" />
                 <div className="h-10 w-36 rounded-md bg-slate-200 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700" />
              </div>
           </div>
           
           <Separator className="mt-4 mb-8" />

           {/* 2. Folders Grid Skeleton */}
           <div className="mb-8">
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4" /> {/* Section Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {/* Generate 4 mock folder cards */}
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
                       <div className="flex justify-between items-start">
                          <div className="h-9 w-9 bg-slate-100 dark:bg-slate-900 rounded-md" />
                          <div className="h-4 w-4 bg-slate-100 dark:bg-slate-900 rounded-full" />
                       </div>
                       <div className="space-y-2 pt-1">
                           <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-900 rounded" />
                           <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-900 rounded" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           {/* 3. Bookmarks Grid Skeleton */}
           <div className="mb-8">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4" /> {/* Section Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {/* Generate 4 mock bookmark cards */}
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
                       <div className="flex justify-between items-start">
                          <div className="h-9 w-9 bg-slate-100 dark:bg-slate-900 rounded-md" />
                          <div className="h-4 w-4 bg-slate-100 dark:bg-slate-900 rounded-full" />
                       </div>
                       <div className="space-y-2 pt-1">
                           <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-900 rounded" />
                           <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-900 rounded" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};