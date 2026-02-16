import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Clock } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { StudentRiskRequest } from '../../core/schemas/xai.schemas';

export function EngagementSection() {
    const { register, control, formState: { errors } } = useFormContext<StudentRiskRequest>();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="assessment_completion_rate" className="flex items-center gap-2 font-semibold">
                        <Clock size={16} className="text-blue-600" />
                        Completion Rate
                    </Label>
                    <div className="relative">
                        <Controller
                            control={control}
                            name="assessment_completion_rate"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="assessment_completion_rate"
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    placeholder="0.0 - 1.0"
                                    className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-16"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                            )}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            Rate
                        </span>
                    </div>
                    {errors.assessment_completion_rate && <p className="text-sm text-destructive">{errors.assessment_completion_rate.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="studied_credits" className="flex items-center gap-2 font-semibold">
                        <BookOpen size={16} className="text-blue-600" />
                        Studied Credits
                    </Label>
                    <Input
                        id="studied_credits"
                        type="number"
                        {...register('studied_credits', { valueAsNumber: true })}
                        min="0"
                        placeholder="Total credits"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {errors.studied_credits && <p className="text-sm text-destructive">{errors.studied_credits.message}</p>}
                </div>
            </div>
        </div>
    );
}