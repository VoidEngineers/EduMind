import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton loader for prediction results
 * Displays while prediction is loading
 */
export function PredictionResultsSkeleton() {
    return (
        <Card className="max-w-7xl mx-auto shadow-lg" aria-busy="true" aria-label="Loading prediction results">
            <CardContent className="pt-8 space-y-8">
                {/* Header Skeleton */}
                <div className="text-center space-y-4">
                    <div className="h-12 w-48 bg-muted rounded-full mx-auto animate-pulse"></div>
                </div>

                {/* Gauge Skeleton */}
                <div className="flex justify-center py-8">
                    <div className="w-60 h-60 bg-muted rounded-full animate-pulse"></div>
                </div>

                {/* Probabilities Skeleton */}
                <div className="space-y-6">
                    <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Action Plan Component Skeleton */}
                <Card className="p-6">
                    <div className="h-10 w-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl animate-pulse"></div>
                    <div className="mt-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-14 h-14 bg-muted rounded-full flex-shrink-0 animate-pulse"></div>
                                <div className="flex-1 space-y-3 bg-muted/50 rounded-xl p-6 animate-pulse">
                                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </CardContent>
        </Card>
    );
}
