import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BookOpen } from 'lucide-react';
import type { SectionProps } from '../../core/types';

export function AcademicEngagementSection({ formData, onInputChange, onSliderChange }: SectionProps) {
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
                    <Slider
                        value={[formData.assignments_completed]}
                        onValueChange={(v) => onSliderChange('assignments_completed', v)}
                        min={0}
                        max={100}
                        step={5}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                        {formData.assignments_completed}%
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Assignments On Time (%)</Label>
                    <Slider
                        value={[formData.assignments_on_time]}
                        onValueChange={(v) => onSliderChange('assignments_on_time', v)}
                        min={0}
                        max={100}
                        step={5}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                        {formData.assignments_on_time}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="quiz_attempts">Avg Quiz Attempts</Label>
                        <Input
                            id="quiz_attempts"
                            name="quiz_attempts"
                            type="number"
                            value={formData.quiz_attempts}
                            onChange={onInputChange}
                            min={1}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quiz_scores">Avg Quiz Score (%)</Label>
                        <Input
                            id="quiz_scores"
                            name="quiz_scores"
                            type="number"
                            value={formData.quiz_scores}
                            onChange={onInputChange}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
