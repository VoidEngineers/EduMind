import { ArrowRight } from 'lucide-react';
import type { ChangedMetricsSummaryProps } from './types';

export function ChangedMetricsSummary({ changedMetrics }: ChangedMetricsSummaryProps) {
    if (changedMetrics.length === 0) return null;

    return (
        <div className="changed-metrics-summary">
            <h3>Modified Metrics ({changedMetrics.length})</h3>
            <div className="metrics-grid">
                {changedMetrics.map(({ label, original, modified, change, unit }) => (
                    <div key={label} className="metric-change-card">
                        <div className="metric-label">{label}</div>
                        <div className="metric-values">
                            <span className="original-value">{original.toFixed(1)}{unit}</span>
                            <ArrowRight size={16} className="arrow-icon" />
                            <span className="modified-value">{modified.toFixed(1)}{unit}</span>
                        </div>
                        <div className={`metric-delta ${change > 0 ? 'positive' : 'negative'}`}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
