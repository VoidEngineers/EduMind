import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { RiskComparisonProps } from './types';

export function RiskComparison({ currentPrediction, simulatedPrediction, riskChange }: RiskComparisonProps) {
    if (!simulatedPrediction || !riskChange) return null;

    return (
        <div className="flex flex-col sm:flex-row items-stretch gap-6">
            {/* Current Risk Card */}
            <Card className="flex-1 p-6 text-center border-t-4 border-t-muted-foreground shadow-sm">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Risk</div>
                <div className="text-4xl font-black text-foreground mb-2">
                    {(currentPrediction.risk_score * 100).toFixed(0)}%
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {currentPrediction.risk_level}
                </div>
            </Card>

            {/* Change Indicator */}
            <div className="flex flex-col items-center justify-center py-2 sm:py-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${riskChange.isImprovement ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mb-1`}>
                    {riskChange.isImprovement ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                </div>
                <span className={`text-sm font-bold ${riskChange.isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                    {riskChange.isImprovement ? '-' : '+'}{riskChange.value.toFixed(1)}%
                </span>
            </div>

            {/* Simulated Risk Card */}
            <Card className="flex-1 p-6 text-center border-t-4 border-t-primary shadow-md ring-1 ring-primary/10">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Simulated Risk</div>
                <div className="text-4xl font-black text-primary mb-2">
                    {(simulatedPrediction.risk_score * 100).toFixed(0)}%
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {simulatedPrediction.risk_level}
                </div>
            </Card>
        </div>
    );
}
