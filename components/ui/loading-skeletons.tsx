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
