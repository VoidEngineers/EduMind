import { MetricSlider } from './MetricSlider';
import type { ScenarioControlsProps } from './types';

export function ScenarioControls({ scenarioData, onSliderChange }: ScenarioControlsProps) {
    return (
        <div className="scenario-controls">
            <h3>Adjust Student Metrics</h3>

            <MetricSlider
                id="avg_grade"
                label="Average Grade"
                value={scenarioData.avg_grade}
                min={0}
                max={100}
                step={0.1}
                unit="%"
                labels={['0%', '50%', '100%']}
                onChange={(value) => onSliderChange('avg_grade', value)}
                formatValue={(value) => `${value.toFixed(1)}%`}
            />

            <MetricSlider
                id="grade_consistency"
                label="Grade Consistency"
                value={scenarioData.grade_consistency}
                min={0}
                max={100}
                step={0.1}
                unit="%"
                labels={['Low', 'Medium', 'High']}
                onChange={(value) => onSliderChange('grade_consistency', value)}
                formatValue={(value) => `${value.toFixed(1)}%`}
            />

            <MetricSlider
                id="assessment_completion_rate"
                label="Assessment Completion Rate"
                value={scenarioData.assessment_completion_rate}
                min={0}
                max={1}
                step={0.01}
                labels={['0%', '50%', '100%']}
                onChange={(value) => onSliderChange('assessment_completion_rate', value)}
                formatValue={(value) => `${(value * 100).toFixed(1)}%`}
            />

            <MetricSlider
                id="num_assessments"
                label="Number of Assessments"
                value={scenarioData.num_assessments}
                min={0}
                max={50}
                step={1}
                labels={['0', '25', '50']}
                onChange={(value) => onSliderChange('num_assessments', value)}
            />

            <MetricSlider
                id="studied_credits"
                label="Studied Credits"
                value={scenarioData.studied_credits}
                min={0}
                max={240}
                step={1}
                labels={['0', '120', '240']}
                onChange={(value) => onSliderChange('studied_credits', value)}
            />

            <MetricSlider
                id="num_of_prev_attempts"
                label="Previous Attempts"
                value={scenarioData.num_of_prev_attempts}
                min={0}
                max={10}
                step={1}
                labels={['0', '5', '10']}
                onChange={(value) => onSliderChange('num_of_prev_attempts', value)}
            />
        </div>
    );
}
