/**
 * Service Interfaces for XAI Predictor
 * Defines contracts for dependency injection
 */

import type { HealthResponse, RiskPredictionResponse, StudentRiskRequest } from '../core/schemas/xai.schemas';

/**
 * XAI Service Interface
 * Defines the contract for risk prediction services
 */
export interface IXAIService {
    /**
     * Predict academic risk based on student data
     * @param data - Student academic and engagement data
     * @returns Promise resolving to risk prediction results
     */
    predictRisk(data: StudentRiskRequest): Promise<RiskPredictionResponse>;

    /**
     * Check service health status
     * @returns Promise resolving to health status
     */
    checkHealth(): Promise<HealthResponse>;
}
