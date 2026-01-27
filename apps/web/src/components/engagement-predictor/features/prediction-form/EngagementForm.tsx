import { Button } from '@/components/ui/button';
import { Activity, Loader2, RotateCcw } from 'lucide-react';
import type { SectionProps } from '../../core/types';
import { AcademicEngagementSection } from './AcademicEngagementSection';
import { ActivityMetricsSection } from './ActivityMetricsSection';
import { ContentInteractionSection } from './ContentInteractionSection';
import { SocialEngagementSection } from './SocialEngagementSection';
import { StudentInfoSection } from './StudentInfoSection';

interface EngagementFormProps extends SectionProps {
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export function EngagementForm({
    formData,
    onInputChange,
    onSliderChange,
    onSubmit,
    onReset,
    isSubmitting,
    error
}: EngagementFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <StudentInfoSection formData={formData} onInputChange={onInputChange} />
            <ActivityMetricsSection formData={formData} onInputChange={onInputChange} />
            <AcademicEngagementSection
                formData={formData}
                onInputChange={onInputChange}
                onSliderChange={onSliderChange}
            />
            <SocialEngagementSection
                formData={formData}
                onInputChange={onInputChange}
                onSliderChange={onSliderChange}
            />
            <ContentInteractionSection
                formData={formData}
                onInputChange={onInputChange}
                onSliderChange={onSliderChange}
            />

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
    );
}
