import { TrendingDown, TrendingUp } from 'lucide-react';
import type { RiskComparisonProps } from './types';

export function RiskComparison({ currentPrediction, simulatedPrediction, riskChange }: RiskComparisonProps) {
    if (!simulatedPrediction || !riskChange) return null;

    return (
        <div className="scenario-comparison">
            <div className="comparison-card">
                <div className="comparison-label">Current Risk</div>
                <div className="comparison-value current">
                    {(currentPrediction.risk_score * 100).toFixed(1)}%
                </div>
                <div className="comparison-level">{currentPrediction.risk_level}</div>
            </div>

            <div className="comparison-arrow">
                {riskChange.isImprovement ? (
                    <TrendingDown size={32} className="trend-down" />
                ) : (
                    <TrendingUp size={32} className="trend-up" />
                )}
                <span className={riskChange.isImprovement ? 'change-positive' : 'change-negative'}>
                    {riskChange.isImprovement ? '-' : '+'}{riskChange.value.toFixed(1)}%
                </span>
                <div className="impact-label">
                    {riskChange.isImprovement ? 'Risk Reduced' : 'Risk Increased'}
                </div>
            </div>

            <div className="comparison-card">
                <div className="comparison-label">Simulated Risk</div>
                <div className="comparison-value simulated">
                    {(simulatedPrediction.risk_score * 100).toFixed(1)}%
                </div>
                <div className="comparison-level">{simulatedPrediction.risk_level}</div>
            </div>
        </div>
    );
}
