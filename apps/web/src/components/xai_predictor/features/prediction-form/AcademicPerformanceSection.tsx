import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, ArrowUp, CheckCircle, TrendingDown } from 'lucide-react';
import type { AcademicPerformanceSectionProps } from './types';

export function AcademicPerformanceSection({ formData, onInputChange }: AcademicPerformanceSectionProps) {
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
                            name="avg_grade"
                            value={formData.avg_grade}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="avg_grade_hint"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            %
                        </span>
                    </div>
                    <span id="avg_grade_hint" className="block text-sm text-muted-foreground italic">
                        Current: {formData.avg_grade}%
                    </span>
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
                            name="grade_consistency"
                            value={formData.grade_consistency}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="grade_consistency_hint"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            %
                        </span>
                    </div>
                    <span id="grade_consistency_hint" className="block text-sm text-muted-foreground italic">
                        Performance stability score
                    </span>
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
                            name="grade_range"
                            value={formData.grade_range}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="grade_range_hint"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            pts
                        </span>
                    </div>
                    <span id="grade_range_hint" className="block text-sm text-muted-foreground italic">
                        Highest - Lowest grade
                    </span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="num_assessments" className="flex items-center gap-2 font-semibold">
                        <CheckCircle size={16} className="text-blue-600" />
                        Number of Assessments
                    </Label>
                    <Input
                        id="num_assessments"
                        type="number"
                        name="num_assessments"
                        value={formData.num_assessments}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="Total assessments"
                        aria-describedby="num_assessments_hint"

                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span id="num_assessments_hint" className="block text-sm text-muted-foreground italic">
                        Completed assessments
                    </span>
                </div>
            </div>
        </div>
    );
}