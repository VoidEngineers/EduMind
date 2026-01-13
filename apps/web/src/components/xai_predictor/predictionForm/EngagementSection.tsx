import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Clock } from 'lucide-react';
import type { EngagementSectionProps } from './types';

export function EngagementSection({ formData, onInputChange }: EngagementSectionProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="assessment_completion_rate" className="flex items-center gap-2 font-semibold">
                        <Clock size={16} className="text-blue-600" />
                        Completion Rate
                    </Label>
                    <div className="relative">
                        <Input
                            id="assessment_completion_rate"
                            type="number"
                            name="assessment_completion_rate"
                            value={formData.assessment_completion_rate}
                            onChange={onInputChange}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            placeholder="0.0 - 1.0"
                            aria-describedby="completion_rate_hint"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-semibold pointer-events-none">
                            {(formData.assessment_completion_rate * 100).toFixed(0)}%
                        </span>
                    </div>
                    <span id="completion_rate_hint" className="block text-sm text-muted-foreground italic">
                        Decimal value (0 = 0%, 1 = 100%)
                    </span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="studied_credits" className="flex items-center gap-2 font-semibold">
                        <BookOpen size={16} className="text-blue-600" />
                        Studied Credits
                    </Label>
                    <Input
                        id="studied_credits"
                        type="number"
                        name="studied_credits"
                        value={formData.studied_credits}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="Total credits"
                        aria-describedby="studied_credits_hint"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span id="studied_credits_hint" className="block text-sm text-muted-foreground italic">
                        Course credits enrolled
                    </span>
                </div>
            </div>
        </div>
    );
}