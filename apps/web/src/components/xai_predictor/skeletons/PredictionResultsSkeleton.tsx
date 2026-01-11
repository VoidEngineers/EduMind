import './PredictionResultsSkeleton.css';

/**
 * Skeleton loader for prediction results
 * Displays while prediction is loading
 */
export function PredictionResultsSkeleton() {
    return (
        <div className="prediction-skeleton" aria-busy="true" aria-label="Loading prediction results">
            <div className="skeleton-header">
                <div className="skeleton-badge"></div>
            </div>

            <div className="skeleton-gauge-section">
                <div className="skeleton-gauge">
                    <div className="skeleton-circle"></div>
                </div>
            </div>

            <div className="skeleton-probabilities">
                <div className="skeleton-title"></div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-probability-item">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-bar"></div>
                    </div>
                ))}
            </div>

            <div className="skeleton-action-plan">
                <div className="skeleton-plan-header">
                    <div className="skeleton-title-large"></div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton-action-item">
                        <div className="skeleton-action-dot"></div>
                        <div className="skeleton-action-card">
                            <div className="skeleton-action-title"></div>
                            <div className="skeleton-action-desc"></div>
                            <div className="skeleton-action-desc short"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
