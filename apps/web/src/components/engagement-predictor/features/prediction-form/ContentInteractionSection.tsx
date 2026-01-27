import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Target } from 'lucide-react';
import type { SectionProps } from '../../core/types';

export function ContentInteractionSection({ formData, onInputChange, onSliderChange }: SectionProps) {
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
                    <Slider
                        value={[formData.video_completion_rate]}
                        onValueChange={(v) => onSliderChange('video_completion_rate', v)}
                        min={0}
                        max={100}
                        step={5}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                        {formData.video_completion_rate}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="resource_downloads">Resource Downloads/Week</Label>
                        <Input
                            id="resource_downloads"
                            name="resource_downloads"
                            type="number"
                            value={formData.resource_downloads}
                            onChange={onInputChange}
                            min={0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time_on_task">Time on Task (min/week)</Label>
                        <Input
                            id="time_on_task"
                            name="time_on_task"
                            type="number"
                            value={formData.time_on_task}
                            onChange={onInputChange}
                            min={0}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
