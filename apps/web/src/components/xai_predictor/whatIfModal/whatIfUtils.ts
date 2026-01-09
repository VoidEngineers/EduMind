import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';
import type { MetricConfig, ChangedMetric, RiskChange } from './types';

export const metricConfigs: MetricConfig[] = [
    { field: 'avg_grade', label: 'Average Grade', unit: '%' },
    { field: 'grade_consistency', label: 'Grade Consistency', unit: '%' },
    { field: 'assessment_completion_rate', label: 'Completion Rate', unit: '%', multiplier: 100 },
    { field: 'num_assessments', label: 'Assessments', unit: '' },
    { field: 'studied_credits', label: 'Credits', unit: '' },
    { field: 'num_of_prev_attempts', label: 'Previous Attempts', unit: '' },
];

export function getRiskChange(
    currentPrediction: RiskPredictionResponse,
    simulatedPrediction: RiskPredictionResponse | null
): RiskChange | null {
    if (!simulatedPrediction) return null;

    const diff = simulatedPrediction.risk_score - currentPrediction.risk_score;
    return {
        value: Math.abs(diff * 100),
        isImprovement: diff < 0,
        percentage: diff
    };
}

export function getChangedMetrics(
    formData: StudentRiskRequest,
    scenarioData: StudentRiskRequest
): ChangedMetric[] {
    const changes: ChangedMetric[] = [];

    metricConfigs.forEach(({ field, label, unit, multiplier = 1 }) => {
        const original = formData[field] as number;
        const modified = scenarioData[field] as number;

        if (original !== modified) {
            changes.push({
                label,
                field,
                original: original * multiplier,
                modified: modified * multiplier,
                change: (modified - original) * multiplier,
                unit
            });
        }
    });

    return changes;
}
