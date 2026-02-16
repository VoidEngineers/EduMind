import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BookOpen } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';

export function AcademicEngagementSection() {
    const { register, control, formState: { errors } } = useFormContext<EngagementSchema>();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Academic Engagement
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Assignments Completed (%)</Label>
                    <Controller
                        name="assignments_completed"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Slider
                                    value={[field.value]}
                                    onValueChange={(v) => field.onChange(v[0])}
                                    min={0}
                                    max={100}
                                    step={5}
                                />
                                <div className="text-right text-sm text-muted-foreground">
                                    {field.value}%
                                </div>
                            </>
                        )}
                    />
                    {errors.assignments_completed && <p className="text-sm text-destructive">{errors.assignments_completed.message}</p>}
                </div>

                <div className="space-y-3">
                    <Label>Assignments On Time (%)</Label>
                    <Controller
                        name="assignments_on_time"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Slider
                                    value={[field.value]}
                                    onValueChange={(v) => field.onChange(v[0])}
                                    min={0}
                                    max={100}
                                    step={5}
                                />
                                <div className="text-right text-sm text-muted-foreground">
                                    {field.value}%
                                </div>
                            </>
                        )}
                    />
                    {errors.assignments_on_time && <p className="text-sm text-destructive">{errors.assignments_on_time.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="quiz_attempts">Avg Quiz Attempts</Label>
                        <Input
                            id="quiz_attempts"
                            type="number"
                            min={1}
                            step={0.1}
                            {...register('quiz_attempts', { valueAsNumber: true })}
                        />
                        {errors.quiz_attempts && <p className="text-sm text-destructive">{errors.quiz_attempts.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quiz_scores">Avg Quiz Score (%)</Label>
                        <Input
                            id="quiz_scores"
                            type="number"
                            min={0}
                            max={100}
                            {...register('quiz_scores', { valueAsNumber: true })}
                        />
                        {errors.quiz_scores && <p className="text-sm text-destructive">{errors.quiz_scores.message}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
