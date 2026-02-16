/**
 * Service Layer Interfaces
 * Define contracts for services (Dependency Inversion Principle)
 */

import type { EngagementFormData, EngagementResult, InterventionItem } from '../core/types';

/**
 * Engagement prediction result
 */
export interface PredictionResult {
    result: EngagementResult;
    interventions: InterventionItem[];
}

/**
 * Service health status
 */
export interface ServiceHealth {
    status: 'healthy' | 'degraded' | 'down';
    message: string;
}

/**
 * Main engagement service interface
 * Components depend on this interface, not the concrete implementation
 */
export interface IEngagementService {
    /**
     * Predict student engagement based on input data
     */
    predictEngagement(data: EngagementFormData): Promise<PredictionResult>;

    /**
     * Check service health
     */
    checkHealth(): Promise<ServiceHealth>;
}

/**
 * Repository interface for future API integration
 * Currently not implemented, but establishes the pattern
 */
export interface IEngagementRepository {
    /**
     * Save engagement data
     */
    save(data: EngagementFormData): Promise<void>;

    /**
     * Retrieve engagement history
     */
    getHistory(studentId: string): Promise<EngagementResult[]>;
}
