import type { LoadingState } from '@/components/common/types/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningStyleForm } from '../prediction-form/LearningStyleForm';
import { PrimaryStyleCard } from '../prediction-results/PrimaryStyleCard';
import { StyleScoresBreakdown } from '../prediction-results/StyleScoresBreakdown';
import type { LearningStyleFormData, LearningStyleResult } from '../../core/types';

interface AnalysisStepProps {
    formData: LearningStyleFormData;
    isLoading: boolean;
    error: string | null;
    loadingState: LoadingState;
    result: LearningStyleResult | null;
    onSubmit: (data: LearningStyleFormData) => Promise<void>;
    onReset: () => void;
    onContinue: () => void;
}

export function AnalysisStep({
    formData,
    isLoading,
    error,
    loadingState,
    result,
    onSubmit,
    onReset,
    onContinue,
}: AnalysisStepProps) {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="pb-4 border-b">
                <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Step 2</div>
                <CardTitle>Learning Style Analysis</CardTitle>
                <CardDescription>Provide study behavior inputs and run the pattern analysis model.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <LearningStyleForm
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    loadingState={loadingState}
                    onSubmit={(data) => void onSubmit(data)}
                    onReset={onReset}
                    showHeader={false}
                />

                {result ? (
                    <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">Analysis Complete</p>
                            <Button onClick={onContinue}>
                                Continue to Recommendations
                            </Button>
                        </div>
                        <PrimaryStyleCard result={result} />
                        <StyleScoresBreakdown result={result} />
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
