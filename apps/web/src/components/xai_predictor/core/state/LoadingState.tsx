import { PredictionResultsSkeleton } from '../../ui/skeletons/PredictionResultsSkeleton';

export function LoadingState() {
    return (
        <div role="status" aria-label="Loading prediction results">
            <PredictionResultsSkeleton />
        </div>
    );
}