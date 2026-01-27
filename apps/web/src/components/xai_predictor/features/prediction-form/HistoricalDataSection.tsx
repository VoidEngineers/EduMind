import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import type { HistoricalDataSectionProps } from './types';

export function HistoricalDataSection({ formData, onInputChange, onSelectChange }: HistoricalDataSectionProps) {
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
                        name="num_of_prev_attempts"
                        value={formData.num_of_prev_attempts}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="0"
                        aria-describedby="prev_attempts_hint"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span id="prev_attempts_hint" className="block text-sm text-muted-foreground italic">
                        Number of retakes
                    </span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="low_performance" className="flex items-center gap-2 font-semibold">
                        <TrendingDown size={16} className="text-blue-600" />
                        Low Performance Flag
                    </Label>
                    <Select
                        value={formData.low_performance.toString()}
                        onValueChange={(value) => onSelectChange('low_performance', parseInt(value))}
                    >
                        <SelectTrigger id="low_performance" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select performance level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No - Grade ≥ 40%</SelectItem>
                            <SelectItem value="1">Yes - Grade &lt; 40%</SelectItem>
                        </SelectContent>
                    </Select>
                    <span id="low_performance_hint" className="block text-sm text-muted-foreground italic">
                        Below 40% threshold
                    </span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="low_engagement" className="flex items-center gap-2 font-semibold">
                        <Activity size={16} className="text-blue-600" />
                        Low Engagement Flag
                    </Label>
                    <Select
                        value={formData.low_engagement.toString()}
                        onValueChange={(value) => onSelectChange('low_engagement', parseInt(value))}
                    >
                        <SelectTrigger id="low_engagement" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select engagement level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No - Active participation</SelectItem>
                            <SelectItem value="1">Yes - Limited participation</SelectItem>
                        </SelectContent>
                    </Select>
                    <span id="low_engagement_hint" className="block text-sm text-muted-foreground italic">
                        Low assessment completion
                    </span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="has_previous_attempts" className="flex items-center gap-2 font-semibold">
                        <Clock size={16} className="text-blue-600" />
                        Has Previous Attempts
                    </Label>
                    <Select
                        value={formData.has_previous_attempts.toString()}
                        onValueChange={(value) => onSelectChange('has_previous_attempts', parseInt(value))}
                    >
                        <SelectTrigger id="has_previous_attempts" className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select attempt status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">No - First attempt</SelectItem>
                            <SelectItem value="1">Yes - Has retaken courses</SelectItem>
                        </SelectContent>
                    </Select>
                    <span id="has_prev_attempts_hint" className="block text-sm text-muted-foreground italic">
                        Failed courses previously
                    </span>
                </div>
            </div>
        </div>
    );
}