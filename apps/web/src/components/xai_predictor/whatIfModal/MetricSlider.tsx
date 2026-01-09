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
        <div className="scenario-item">
            <div className="slider-header">
                <label htmlFor={id}>{label}</label>
                <span className="slider-value">{displayValue}</span>
            </div>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="scenario-slider"
            />
            <div className="slider-labels">
                {labels.map((labelText, index) => (
                    <span key={index}>{labelText}</span>
                ))}
            </div>
        </div>
    );
}
