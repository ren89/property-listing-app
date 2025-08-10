import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-80" />

      <div className="border rounded-lg">
        <div className="border-b p-4">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border-b last:border-b-0 p-4">
            <div className="flex space-x-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
