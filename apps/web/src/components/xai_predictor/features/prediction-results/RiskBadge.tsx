import { Badge } from '@/components/ui/badge';
import type { RiskBadgeProps } from './types';

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
    const getBadgeStyles = () => {
        if (riskLevel === 'At-Risk') {
            return 'bg-red-50 text-red-700 border-red-200 border hover:bg-red-100 px-6 py-2 shadow-sm font-semibold';
        }
        if (riskLevel === 'Medium Risk') {
            return 'bg-amber-50 text-amber-700 border-amber-200 border hover:bg-amber-100 px-6 py-2 shadow-sm font-semibold';
        }
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 border hover:bg-emerald-100 px-6 py-2 shadow-sm font-semibold';
    };

    return (
        <div className="text-center py-8 border-b">
            <Badge
                className={`${getBadgeStyles()} uppercase tracking-wider`}
                role="status"
                aria-label={`Risk level: ${riskLevel}`}
            >
                {riskLevel}
            </Badge>
        </div>
    );
}