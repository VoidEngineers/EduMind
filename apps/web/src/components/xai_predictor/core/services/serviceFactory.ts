/**
 * XAI Service Factory
 * Creates service instances with different configurations
 */

import type { IXAIService } from '../../data/interfaces';
import type { HealthResponse, RiskPredictionResponse, StudentRiskRequest } from '../schemas/xai.schemas';
import { xaiService } from './xaiService';

export type ServiceEnvironment = 'production' | 'development' | 'test';

export interface ServiceConfig {
    environment: ServiceEnvironment;
    mockDelay?: number;
    enableLogging?: boolean;
}

/**
 * Create an XAI service instance
 */
export function createXAIService(config: ServiceConfig): IXAIService {
    const { environment, mockDelay = 1500, enableLogging = false } = config;

    if (environment === 'test') {
        return createMockService(mockDelay);
    }

    if (environment === 'development' && enableLogging) {
        return createLoggingService(xaiService);
    }

    // Default production service
    return xaiService;
}

/**
 * Create a mock service with configurable delay
 */
function createMockService(delay: number): IXAIService {
    return {
        async predictRisk(data: StudentRiskRequest): Promise<RiskPredictionResponse> {
            await new Promise(resolve => setTimeout(resolve, delay));

            const riskScore = Math.random();
            const riskLevel = riskScore > 0.7 ? 'At-Risk' : riskScore > 0.3 ? 'Medium Risk' : 'Safe';

            return {
                student_id: data.student_id,
                risk_level: riskLevel,
                risk_score: riskScore,
                confidence: 85,
                probabilities: {
                    'Safe': riskScore < 0.3 ? 0.7 : 0.2,
                    'Medium Risk': riskScore > 0.3 && riskScore < 0.7 ? 0.6 : 0.3,
                    'At-Risk': riskScore > 0.7 ? 0.8 : 0.1,
                },
                recommendations: [
                    'Schedule regular check-ins with academic advisor',
                    'Attend study skills workshops',
                    'Join peer study groups',
                ],
                top_risk_factors: [
                    { feature: 'avg_grade', value: data.avg_grade, impact: 'negative' },
                    { feature: 'assessment_completion_rate', value: data.assessment_completion_rate, impact: 'negative' },
                    { feature: 'grade_consistency', value: data.grade_consistency, impact: 'positive' },
                ],
                prediction_id: `mock-${Date.now()}`,
                timestamp: new Date().toISOString(),
            };
        },
        async checkHealth(): Promise<HealthResponse> {
            return {
                status: 'healthy',
                service: 'xai-predictor-mock',
                version: '1.0.0-mock',
                model_loaded: true,
                environment: 'test',
            };
        },
    };
}

/**
 * Create a service wrapper with logging
 */
function createLoggingService(service: IXAIService): IXAIService {
    return {
        async predictRisk(data: StudentRiskRequest): Promise<RiskPredictionResponse> {
            console.log('[XAIService] Predicting risk for:', data.student_id);
            const start = Date.now();

            try {
                const result = await service.predictRisk(data);
                const duration = Date.now() - start;
                console.log(`[XAIService] Prediction completed in ${duration}ms`);
                console.log('[XAIService] Risk Level:', result.risk_level);
                console.log('[XAIService] Risk Score:', result.risk_score);
                return result;
            } catch (error) {
                console.error('[XAIService] Prediction failed:', error);
                throw error;
            }
        },
        async checkHealth(): Promise<HealthResponse> {
            console.log('[XAIService] Health check');
            const start = Date.now();

            try {
                const result = await service.checkHealth();
                const duration = Date.now() - start;
                console.log(`[XAIService] Health check completed in ${duration}ms - Status: ${result.status}`);
                return result;
            } catch (error) {
                console.error('[XAIService] Health check failed:', error);
                throw error;
            }
        },
    };
}

// Default service instance
export const defaultXAIService = createXAIService({
    environment: import.meta.env.MODE === 'test' ? 'test' : 'production',
    enableLogging: import.meta.env.DEV,
});
