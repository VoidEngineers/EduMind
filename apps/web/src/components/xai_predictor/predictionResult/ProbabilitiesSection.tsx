import type { ProbabilitiesSectionProps } from './types';

export function ProbabilitiesSection({ probabilities }: ProbabilitiesSectionProps) {
    const getBarColor = (key: string): string => {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('safe')) return '#22c55e';
        if (keyLower.includes('medium')) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="probabilities">
            <h3>Prediction Probabilities</h3>
            {Object.entries(probabilities).map(([key, value]) => (
                <div key={key} className="probability-item">
                    <div className="probability-label">
                        <span>{key}</span>
                        <span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <div
                        className="probability-bar-container"
                        role="progressbar"
                        aria-valuenow={value * 100}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${key} probability: ${(value * 100).toFixed(1)} percent`}
                    >
                        <div
                            className="probability-bar-modern"
                            style={{
                                width: `${value * 100}%`,
                                background: getBarColor(key),
                            }}
                        >
                            <span className="probability-value">{(value * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}