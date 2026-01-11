import type { RiskBadgeProps } from './types';

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
    const getBadgeClass = () => {
        if (riskLevel === 'At-Risk') return 'risk-at-risk';
        if (riskLevel === 'Medium Risk') return 'risk-medium';
        return 'risk-safe';
    };

    return (
        <div className="result-header">
            <span
                className={`risk-badge ${getBadgeClass()}`}
                role="status"
                aria-label={`Risk level: ${riskLevel}`}
            >
                {riskLevel}
            </span>
        </div>
    );
}