/**
 * Engagement Prediction Service
 * Implements IEngagementService interface
 */

import type { EngagementFormData } from '../core/types';
import { calculateEngagement } from './calculators';
import type { IEngagementService, PredictionResult, ServiceHealth } from './interfaces';
import { generateInterventions } from './interventions';

class EngagementService implements IEngagementService {
    /**
     * Predict engagement based on student data
     */
    async predictEngagement(data: EngagementFormData): Promise<PredictionResult> {
        // Validate input
        if (!data.student_id) {
            throw new Error('Student ID is required');
        }

        // Calculate core engagement metrics and level
        const result = calculateEngagement(data);

        // Generate actionable interventions based on the result
        const interventions = generateInterventions(result);

        return { result, interventions };
    }

    /**
     * Check if service is healthy
     */
    async checkHealth(): Promise<ServiceHealth> {
        return { status: 'healthy', message: 'Engagement Prediction service is operational' };
    }
}

// Export singleton instance
export const engagementService = new EngagementService();

// Export class for testing/DI purposes
export { EngagementService };
