import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Target } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';

export function ContentInteractionSection() {
    const { register, control, formState: { errors } } = useFormContext<EngagementSchema>();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Content Interaction
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Video Completion Rate (%)</Label>
                    <Controller
                        name="video_completion_rate"
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
                    {errors.video_completion_rate && <p className="text-sm text-destructive">{errors.video_completion_rate.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="resource_downloads">Resource Downloads/Week</Label>
                        <Input
                            id="resource_downloads"
                            type="number"
                            min={0}
                            {...register('resource_downloads', { valueAsNumber: true })}
                        />
                        {errors.resource_downloads && <p className="text-sm text-destructive">{errors.resource_downloads.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time_on_task">Time on Task (min/week)</Label>
                        <Input
                            id="time_on_task"
                            type="number"
                            min={0}
                            {...register('time_on_task', { valueAsNumber: true })}
                        />
                        {errors.time_on_task && <p className="text-sm text-destructive">{errors.time_on_task.message}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
