import { Skeleton } from "./skeleton"

export function AlbumSkeleton() {
  return (
    <div className="bg-background-lighter rounded-lg overflow-hidden border border-accent">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export function TourDateSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 mb-4 bg-background rounded-lg border border-accent">
      <div className="flex items-start sm:items-center mb-4 sm:mb-0">
        <div className="bg-accent p-3 rounded-lg text-center mr-6 hidden sm:block">
          <Skeleton className="h-6 w-8" />
        </div>
        <div>
          <Skeleton className="h-5 w-48 mb-2" />
          <div className="flex items-center text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4 mr-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

export function GearItemSkeleton() {
  return (
    <div className="bg-background-lighter rounded-lg overflow-hidden border border-accent">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full p-4" />
      </div>
      <div className="p-4">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex items-center text-sm text-muted-foreground">
          <Skeleton className="h-4 w-4 mr-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function MerchItemSkeleton() {
  return (
    <div className="bg-background rounded-lg overflow-hidden border border-accent">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export function SectionHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}
