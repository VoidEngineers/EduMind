import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar Skeleton */}
            <div className="fixed top-0 left-0 right-0 z-50 h-16 md:h-14 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                {/* Hero / Header Section */}
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4 max-w-2xl" />
                    <Skeleton className="h-4 w-1/2 max-w-xl" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="p-6 border rounded-xl space-y-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-24 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

// Also export a simpler Spinner for smaller waits if needed
export function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}
