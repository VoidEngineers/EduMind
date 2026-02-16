import type { EngagementResult, InterventionItem } from '../core/types';

export function generateInterventions(result: EngagementResult): InterventionItem[] {
    const interventions: InterventionItem[] = [];

    if (result.engagement_level === 'at_risk' || result.engagement_level === 'disengaged') {
        interventions.push({
            id: '1',
            title: 'Schedule Advisor Meeting',
            description: 'Meet with academic advisor to discuss engagement concerns',
            priority: result.engagement_level === 'disengaged' ? 'urgent' : 'high',
            category: 'academic',
            isCompleted: false,
        });
    }

    result.risk_factors.forEach((factor, index) => {
        interventions.push({
            id: (index + 2).toString(),
            title: `Address: ${factor}`,
            description: result.recommendations[index] || 'Work on improving this area',
            priority: index === 0 ? 'high' : 'medium',
            category: factor.includes('forum') ? 'social' : factor.includes('assignment') ? 'academic' : 'motivational',
            isCompleted: false,
        });
    });

    return interventions.slice(0, 5);
}
