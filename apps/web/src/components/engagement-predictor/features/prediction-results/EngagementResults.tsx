import { Button } from '@/components/ui/button';
import type { EngagementResult, InterventionItem } from '@/store/engagementStore';
import { Activity, RotateCcw } from 'lucide-react';
import { DetailedScoresGrid } from './DetailedScoresGrid';
import { EngagementScoreCard } from './EngagementScoreCard';
import { InterventionPlan } from './InterventionPlan';
import { RiskAndStrengthsSection } from './RiskAndStrengthsSection';

interface EngagementResultsProps {
    result: EngagementResult;
    interventions: InterventionItem[];
    progress: number;
    studentId: string;
    onReset: () => void;
    onToggleIntervention: (id: string) => void;
}

export function EngagementResults({
    result,
    interventions,
    progress,
    studentId,
    onReset,
    onToggleIntervention
}: EngagementResultsProps) {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        Engagement Analysis
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Student ID: {studentId}
                    </p>
                </div>
                <Button variant="outline" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            <EngagementScoreCard result={result} />
            <DetailedScoresGrid scores={result.detailed_scores} />
            <RiskAndStrengthsSection
                riskFactors={result.risk_factors}
                strengths={result.strengths}
            />
            <InterventionPlan
                interventions={interventions}
                progress={progress}
                onToggleComplete={onToggleIntervention}
            />
        </div>
    );
}
