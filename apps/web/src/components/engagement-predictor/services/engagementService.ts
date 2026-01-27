/**
 * Engagement Prediction Service
 * Orchestrates engagement prediction logic by composing specialized utilities
 */

import type { EngagementFormData, EngagementResult, InterventionItem } from '@/store/engagementStore';
import { calculateEngagement } from './calculators';
import { generateInterventions } from './interventions';

export const engagementService = {
    /**
     * Predict engagement based on student data
     */
    async predictEngagement(data: EngagementFormData): Promise<{ result: EngagementResult; interventions: InterventionItem[] }> {
        // Validate input
        if (!data.student_id) {
            throw new Error('Student ID is required');
        }

        // Calculate core engagement metrics and level
        const result = calculateEngagement(data);

        // Generate actionable interventions based on the result
        const interventions = generateInterventions(result);

        return { result, interventions };
    },

    /**
     * Check if service is healthy
     */
    async checkHealth(): Promise<{ status: 'healthy' | 'degraded' | 'down'; message: string }> {
        return { status: 'healthy', message: 'Engagement Prediction service is operational' };
    },
};
