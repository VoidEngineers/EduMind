import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, ArrowUp, CheckCircle, TrendingDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { StudentRiskRequest } from '../../core/schemas/xai.schemas';

export function AcademicPerformanceSection() {
    const { register, formState: { errors } } = useFormContext<StudentRiskRequest>();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="avg_grade" className="flex items-center gap-2 font-semibold">
                        <TrendingDown size={16} className="text-blue-600" />
                        Average Grade
                    </Label>
                    <div className="relative">
                        <Input
                            id="avg_grade"
                            type="number"
                            {...register('avg_grade', { valueAsNumber: true })}
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0-100"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            %
                        </span>
                    </div>
                    {errors.avg_grade && <p className="text-sm text-destructive">{errors.avg_grade.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="grade_consistency" className="flex items-center gap-2 font-semibold">
                        <Activity size={16} className="text-blue-600" />
                        Grade Consistency
                    </Label>
                    <div className="relative">
                        <Input
                            id="grade_consistency"
                            type="number"
                            {...register('grade_consistency', { valueAsNumber: true })}
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0-100"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            %
                        </span>
                    </div>
                    {errors.grade_consistency && <p className="text-sm text-destructive">{errors.grade_consistency.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="grade_range" className="flex items-center gap-2 font-semibold">
                        <ArrowUp size={16} className="text-blue-600" />
                        Grade Range
                    </Label>
                    <div className="relative">
                        <Input
                            id="grade_range"
                            type="number"
                            {...register('grade_range', { valueAsNumber: true })}
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0-100"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            pts
                        </span>
                    </div>
                    {errors.grade_range && <p className="text-sm text-destructive">{errors.grade_range.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="num_assessments" className="flex items-center gap-2 font-semibold">
                        <CheckCircle size={16} className="text-blue-600" />
                        Number of Assessments
                    </Label>
                    <Input
                        id="num_assessments"
                        type="number"
                        {...register('num_assessments', { valueAsNumber: true })}
                        min="0"
                        placeholder="Total assessments"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {errors.num_assessments && <p className="text-sm text-destructive">{errors.num_assessments.message}</p>}
                </div>
            </div>
        </div>
    );
}