import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { StudentRiskRequest } from '../../core/schemas/xai.schemas';

export function HistoricalDataSection() {
    const { register, control, formState: { errors } } = useFormContext<StudentRiskRequest>();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="num_of_prev_attempts" className="flex items-center gap-2 font-semibold">
                        <AlertTriangle size={16} className="text-blue-600" />
                        Previous Attempts
                    </Label>
                    <Input
                        id="num_of_prev_attempts"
                        type="number"
                        {...register('num_of_prev_attempts', { valueAsNumber: true })}
                        min="0"
                        placeholder="0"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {errors.num_of_prev_attempts && <p className="text-sm text-destructive">{errors.num_of_prev_attempts.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="low_performance" className="flex items-center gap-2 font-semibold">
                        <TrendingDown size={16} className="text-blue-600" />
                        Low Performance Flag
                    </Label>
                    <Controller
                        name="low_performance"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                                <SelectTrigger id="low_performance" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="Select performance level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">No - Grade ≥ 40%</SelectItem>
                                    <SelectItem value="1">Yes - Grade &lt; 40%</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.low_performance && <p className="text-sm text-destructive">{errors.low_performance.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="low_engagement" className="flex items-center gap-2 font-semibold">
                        <Activity size={16} className="text-blue-600" />
                        Low Engagement Flag
                    </Label>
                    <Controller
                        name="low_engagement"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                                <SelectTrigger id="low_engagement" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="Select engagement level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">No - Active participation</SelectItem>
                                    <SelectItem value="1">Yes - Limited participation</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.low_engagement && <p className="text-sm text-destructive">{errors.low_engagement.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="has_previous_attempts" className="flex items-center gap-2 font-semibold">
                        <Clock size={16} className="text-blue-600" />
                        Has Previous Attempts
                    </Label>
                    <Controller
                        name="has_previous_attempts"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                                <SelectTrigger id="has_previous_attempts" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                                    <SelectValue placeholder="Select attempt status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">No - First attempt</SelectItem>
                                    <SelectItem value="1">Yes - Has retaken courses</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.has_previous_attempts && <p className="text-sm text-destructive">{errors.has_previous_attempts.message}</p>}
                </div>
            </div>
        </div>
    );
}