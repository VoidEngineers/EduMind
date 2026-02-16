/**
 * XAI Service Factory
 * Creates XAI service instances with different configurations
 */

import type { HealthResponse, RiskPredictionResponse, StudentRiskRequest } from '../schemas/xai.schemas';
import XAIService, { xaiService } from './xaiService';

export type ServiceEnvironment = 'production' | 'development' | 'test';

export interface XAIServiceConfig {
    environment: ServiceEnvironment;
    baseURL?: string;
    mockDelay?: number;
    enableLogging?: boolean;
}

export interface IXAIService {
    checkHealth(): Promise<HealthResponse>;
    predictRisk(studentData: StudentRiskRequest): Promise<RiskPredictionResponse>;
    batchPredict(students: StudentRiskRequest[]): Promise<RiskPredictionResponse[]>;
    getModelInfo(): Promise<unknown>;
}

/**
 * Create an XAI service instance
 */
export function createXAIService(config: XAIServiceConfig): IXAIService {
    const { environment, baseURL, mockDelay = 1500, enableLogging = false } = config;

    if (environment === 'test') {
        return createMockService(mockDelay);
    }

    if (environment === 'development' && enableLogging) {
        return createLoggingService(baseURL ? new XAIService(baseURL) : xaiService);
    }

    // Default production service
    return baseURL ? new XAIService(baseURL) : xaiService;
}

/**
 * Create a mock service with configurable delay
 */
function createMockService(delay: number): IXAIService {
    return {
        async checkHealth() {
            await new Promise(resolve => setTimeout(resolve, delay));
            return {
                status: 'healthy',
                service: 'xai-mock-service',
                version: '1.0.0',
                model_loaded: true,
                environment: 'test',
            };
        },
        async predictRisk(_studentData) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return {
                prediction_id: `mock-${Date.now()}`,
                student_id: _studentData.student_id,
                risk_score: 0.65,
                risk_level: 'Medium Risk',
                confidence: 85,
                probabilities: {
                    Safe: 0.15,
                    'Medium Risk': 0.65,
                    'At-Risk': 0.20,
                },
                top_risk_factors: [
                    { feature: 'avg_grade', value: _studentData.avg_grade, impact: 'High' },
                    { feature: 'assessment_completion_rate', value: _studentData.assessment_completion_rate, impact: 'Medium' },
                    { feature: 'grade_consistency', value: _studentData.grade_consistency, impact: 'Medium' },
                ],
                recommendations: [
                    'Improve study consistency',
                    'Complete all assessments on time',
                ],
                timestamp: new Date().toISOString(),
            };
        },
        async batchPredict(students) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return students.map(student => {
                const riskScore = Math.random() * 0.5 + 0.3;
                const riskLevel = riskScore > 0.7 ? 'At-Risk' : riskScore > 0.4 ? 'Medium Risk' : 'Safe';
                return {
                    prediction_id: `mock-${Date.now()}-${student.student_id}`,
                    student_id: student.student_id,
                    risk_score: riskScore,
                    risk_level: riskLevel,
                    confidence: 85,
                    probabilities: {
                        Safe: riskLevel === 'Safe' ? 0.7 : 0.15,
                        'Medium Risk': riskLevel === 'Medium Risk' ? 0.6 : 0.25,
                        'At-Risk': riskLevel === 'At-Risk' ? 0.7 : 0.1,
                    },
                    top_risk_factors: [
                        { feature: 'avg_grade', value: student.avg_grade, impact: 'High' },
                        { feature: 'assessment_completion_rate', value: student.assessment_completion_rate, impact: 'Medium' },
                    ],
                    recommendations: [
                        'Review study habits',
                        'Seek academic support if needed',
                    ],
                    timestamp: new Date().toISOString(),
                };
            });
        },
        async getModelInfo() {
            await new Promise(resolve => setTimeout(resolve, delay));
            return {
                model_name: 'Mock XAI Model',
                version: '1.0.0',
                features: 11,
            };
        },
    };
}

/**
 * Create a service wrapper with logging
 */
function createLoggingService(service: IXAIService): IXAIService {
    return {
        async checkHealth() {
            console.log('[XAIService] Health check');
            const start = Date.now();
            try {
                const result = await service.checkHealth();
                console.log(`[XAIService] Health check completed in ${Date.now() - start}ms`);
                return result;
            } catch (error) {
                console.error('[XAIService] Health check failed:', error);
                throw error;
            }
        },
        async predictRisk(studentData) {
            console.log('[XAIService] Predicting risk for:', studentData.student_id);
            const start = Date.now();
            try {
                const result = await service.predictRisk(studentData);
                console.log(`[XAIService] Prediction completed in ${Date.now() - start}ms`);
                return result;
            } catch (error) {
                console.error('[XAIService] Prediction failed:', error);
                throw error;
            }
        },
        async batchPredict(students) {
            console.log(`[XAIService] Batch predicting for ${students.length} students`);
            const start = Date.now();
            try {
                const result = await service.batchPredict(students);
                console.log(`[XAIService] Batch prediction completed in ${Date.now() - start}ms`);
                return result;
            } catch (error) {
                console.error('[XAIService] Batch prediction failed:', error);
                throw error;
            }
        },
        async getModelInfo() {
            console.log('[XAIService] Getting model info');
            return service.getModelInfo();
        },
    };
}

// Default service instance
export const defaultXAIService = createXAIService({
    environment: import.meta.env.MODE === 'test' ? 'test' : 'production',
    enableLogging: import.meta.env.DEV,
});
