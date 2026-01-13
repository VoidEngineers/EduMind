import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { MetricSliderProps } from './types';

export function MetricSlider({
    id,
    label,
    value,
    min,
    max,
    step,
    unit = '',
    labels,
    onChange,
    formatValue
}: MetricSliderProps) {
    const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

    return (
        <div className="space-y-3 py-1">
            <div className="flex justify-between items-center">
                <Label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</Label>
                <div className="text-sm font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md tabular-nums">
                    {displayValue}
                </div>
            </div>
            <Slider
                id={id}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0])}
                className="py-1 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground/70 px-0.5 uppercase tracking-wide">
                {labels.map((labelText, index) => (
                    <span key={index}>{labelText}</span>
                ))}
            </div>
        </div>
    );
}
