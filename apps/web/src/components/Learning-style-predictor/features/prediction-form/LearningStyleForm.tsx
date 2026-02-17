/**
 * Learning Style Form Component
 * Main form for learning style analysis
 */

import type { LoadingState } from '@/components/common/types/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader2, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { learningStyleSchema, type LearningStyleSchema } from '../../core/schemas/learningStyleSchema';
import type { LearningStyleFormData } from '../../core/types';

interface LearningStyleFormProps {
    formData: LearningStyleFormData;
    isLoading: boolean;
    error: string | null;
    loadingState?: LoadingState;
    onSubmit: (data: LearningStyleFormData) => void;
    onReset: () => void;
    showHeader?: boolean;
}

export function LearningStyleForm({
    formData,
    isLoading,
    error,
    loadingState,
    onSubmit,
    onReset,
    showHeader = true,
}: LearningStyleFormProps) {
    const form = useForm<LearningStyleSchema>({
        resolver: zodResolver(learningStyleSchema),
        defaultValues: formData,
    });

    useEffect(() => {
        form.reset(formData);
    }, [form, formData]);

    const { register, handleSubmit, formState: { errors } } = form;

    const formContent = (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Info */}
            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4 border-b">
                    <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            placeholder="Enter student ID"
                            {...register('student_id')}
                        />
                        {errors.student_id && <p className="text-sm text-destructive">{errors.student_id.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Time Metrics */}
            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4 border-b">
                    <CardTitle>Learning Activity Time (minutes per session)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="video_watch_time">Video Watching</Label>
                        <Input
                            id="video_watch_time"
                            type="number"
                            min={0}
                            {...register('video_watch_time', { valueAsNumber: true })}
                        />
                        {errors.video_watch_time && <p className="text-sm text-destructive">{errors.video_watch_time.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reading_time">Reading</Label>
                        <Input
                            id="reading_time"
                            type="number"
                            min={0}
                            {...register('reading_time', { valueAsNumber: true })}
                        />
                        {errors.reading_time && <p className="text-sm text-destructive">{errors.reading_time.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interactive_time">Interactive Activities</Label>
                        <Input
                            id="interactive_time"
                            type="number"
                            min={0}
                            {...register('interactive_time', { valueAsNumber: true })}
                        />
                        {errors.interactive_time && <p className="text-sm text-destructive">{errors.interactive_time.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Hidden defaults for removed sections to keep schema and service contract valid */}
            <input type="hidden" {...register('prefers_diagrams', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_lectures', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_reading', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_hands_on', { valueAsNumber: true })} />
            <input type="hidden" {...register('note_taking_style')} />
            <input type="hidden" {...register('study_environment')} />
            <input type="hidden" {...register('retention_method')} />

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {loadingState?.message || 'Analyzing...'}
                        </>
                    ) : (
                        <>
                            <Brain className="h-4 w-4 mr-2" />
                            Analyze Learning Style
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

    if (!showHeader) {
        return formContent;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    Learning Style Predictor
                </h1>
                <p className="text-muted-foreground mt-2">
                    Discover your preferred learning style to optimize your study approach
                </p>
            </div>
            {formContent}
        </div>
    );
}
