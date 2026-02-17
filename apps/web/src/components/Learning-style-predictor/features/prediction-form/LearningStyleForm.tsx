/**
 * Learning Style Form Component
 * Main form for collecting learning preferences
 */

import type { LoadingState } from '@/components/common/types/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader2, RotateCcw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { PREFERENCE_FIELDS } from '../../core/constants';
import { learningStyleSchema, type LearningStyleSchema } from '../../core/schemas/learningStyleSchema';
import type { LearningStyleFormData } from '../../core/types';

interface LearningStyleFormProps {
    formData: LearningStyleFormData;
    isLoading: boolean;
    error: string | null;
    loadingState?: LoadingState;
    onSubmit: (data: LearningStyleFormData) => void;
    onReset: () => void;
}

export function LearningStyleForm({
    formData,
    isLoading,
    error,
    loadingState,
    onSubmit,
    onReset,
}: LearningStyleFormProps) {
    const form = useForm<LearningStyleSchema>({
        resolver: zodResolver(learningStyleSchema),
        defaultValues: formData,
    });

    const { register, control, handleSubmit, formState: { errors } } = form;

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
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

                {/* Learning Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Preferences</CardTitle>
                        <CardDescription>Rate your preferences on a scale of 1-5</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {PREFERENCE_FIELDS.map((item) => (
                            <div key={item.name} className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Label>
                                <Controller
                                    name={item.name as keyof LearningStyleSchema}
                                    control={control}
                                    render={({ field }) => (
                                        <Slider
                                            value={[Number(field.value)]}
                                            onValueChange={(v) => field.onChange(v[0])}
                                            min={1}
                                            max={5}
                                            step={1}
                                        />
                                    )}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Not preferred</span>
                                    <span>Highly preferred</span>
                                </div>
                                {errors[item.name as keyof LearningStyleSchema] && (
                                    <p className="text-sm text-destructive">{errors[item.name as keyof LearningStyleSchema]?.message}</p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Study Habits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Study Habits</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Note-Taking Style</Label>
                            <Controller
                                name="note_taking_style"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="visual">Visual (diagrams, mind maps)</SelectItem>
                                            <SelectItem value="written">Written (detailed notes)</SelectItem>
                                            <SelectItem value="audio">Audio (recordings)</SelectItem>
                                            <SelectItem value="mixed">Mixed approach</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Study Environment</Label>
                            <Controller
                                name="study_environment"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select environment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="quiet">Quiet (library, private room)</SelectItem>
                                            <SelectItem value="music">With music/background noise</SelectItem>
                                            <SelectItem value="group">Group/collaborative setting</SelectItem>
                                            <SelectItem value="varies">Varies by task</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>How do you best retain information?</Label>
                            <Controller
                                name="retention_method"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="seeing">Seeing (visual memory)</SelectItem>
                                            <SelectItem value="hearing">Hearing (auditory memory)</SelectItem>
                                            <SelectItem value="doing">Doing (muscle memory)</SelectItem>
                                            <SelectItem value="reading">Reading (text memory)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Time Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Activity Time (minutes per session)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
    );
}
