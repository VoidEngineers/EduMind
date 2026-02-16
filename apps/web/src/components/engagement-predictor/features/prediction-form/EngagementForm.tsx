import { Button } from '@/components/ui/button';
import { Activity, Loader2, RotateCcw } from 'lucide-react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';
// Sub-sections
import { AcademicEngagementSection } from './AcademicEngagementSection';
import { ActivityMetricsSection } from './ActivityMetricsSection';
import { ContentInteractionSection } from './ContentInteractionSection';
import { SocialEngagementSection } from './SocialEngagementSection';
import { StudentInfoSection } from './StudentInfoSection';

interface EngagementFormProps {
    form: UseFormReturn<EngagementSchema>;
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export function EngagementForm({
    form,
    onSubmit,
    onReset,
    isSubmitting,
    error
}: EngagementFormProps) {
    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
                <StudentInfoSection />
                <ActivityMetricsSection />
                <AcademicEngagementSection />
                <SocialEngagementSection />
                <ContentInteractionSection />

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Activity className="h-4 w-4 mr-2" />
                                Analyze Engagement
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={onReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
