/**
 * Learning Style Results View
 * Main results display component
 */

import { Button } from '@/components/ui/button';
import { Brain, RotateCcw } from 'lucide-react';
import type { LearningStyleFormData, LearningStyleResult } from '../../core/types';
import { PrimaryStyleCard } from './PrimaryStyleCard';
import { RecommendationsList } from './RecommendationsList';
import { StyleScoresBreakdown } from './StyleScoresBreakdown';

interface LearningStyleResultsViewProps {
    result: LearningStyleResult;
    formData: LearningStyleFormData;
    onReset: () => void;
}

export function LearningStyleResultsView({
    result,
    formData,
    onReset
}: LearningStyleResultsViewProps) {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Brain className="h-8 w-8 text-primary" />
                        Learning Style Analysis
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Student ID: {formData.student_id}
                    </p>
                </div>
                <Button variant="outline" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            <PrimaryStyleCard result={result} />
            <StyleScoresBreakdown result={result} />
            <RecommendationsList result={result} />
        </div>
    );
}
