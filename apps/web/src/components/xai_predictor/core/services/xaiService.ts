/**
 * XAI Prediction Service
 * Handles all API calls to the XAI backend service with validation
 */

import type { IXAIService } from '../../data/interfaces';
import { XAIError } from '../errors/XAIError';
import {
    HealthResponseSchema,
    RiskPredictionResponseSchema,
    StudentRiskRequestSchema,
    type HealthResponse,
    type RiskPredictionResponse,
    type StudentRiskRequest,
} from '../schemas/xai.schemas';

const API_BASE_URL = import.meta.env.VITE_XAI_API_URL || 'http://localhost:8000';

class XAIService implements IXAIService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Check if the service is healthy
     */
    async checkHealth(): Promise<HealthResponse> {
        try {
            const response = await fetch(`${this.baseURL}/health`);

            if (!response.ok) {
                throw new XAIError(`Health check failed: ${response.statusText}`, {
                    statusCode: response.status,
                    userMessage: 'Unable to check model health. The service may be down.',
                });
            }

            const data = await response.json();

            // Validate response with Zod
            const validatedData = HealthResponseSchema.parse(data);
            return validatedData;
        } catch (error) {
            if (error instanceof XAIError) {
                throw error;
            }
            throw XAIError.fromUnknown(error);
        }
    }

    /**
     * Predict academic risk for a student
     */
    async predictRisk(studentData: StudentRiskRequest): Promise<RiskPredictionResponse> {
        try {
            // Validate request data with Zod
            const validatedRequest = StudentRiskRequestSchema.parse(studentData);

            console.log('XAIService - Sending request to API:', validatedRequest);

            const response = await fetch(`${this.baseURL}/api/v1/academic-risk/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedRequest),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: response.statusText }));
                throw new XAIError(error.detail || 'Prediction failed', {
                    statusCode: response.status,
                    details: error,
                });
            }

            const data = await response.json();

            // Debug logging - see raw API response
            console.log('XAIService - Raw API response:', data);
            console.log('XAIService - Raw risk_score from API:', data.risk_score);
            console.log('XAIService - risk_score type:', typeof data.risk_score);

            // Validate response with Zod
            const validatedData = RiskPredictionResponseSchema.parse(data);

            console.log('XAIService - Validated data:', validatedData);
            console.log('XAIService - Validated risk_score:', validatedData.risk_score);

            return validatedData;
        } catch (error) {
            console.error('XAIService - Error in predictRisk:', error);
            if (error instanceof XAIError) {
                throw error;
            }
            throw XAIError.fromUnknown(error);
        }
    }

    /**
     * Batch predict for multiple students
     */
    async batchPredict(students: StudentRiskRequest[]): Promise<RiskPredictionResponse[]> {
        try {
            // Validate all student data
            const validatedStudents = students.map(student =>
                StudentRiskRequestSchema.parse(student)
            );

            const response = await fetch(`${this.baseURL}/api/v1/academic-risk/batch-predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students: validatedStudents }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: response.statusText }));
                throw new XAIError(error.detail || 'Batch prediction failed', {
                    statusCode: response.status,
                    details: error,
                });
            }

            const data = await response.json();

            // Validate response array
            const validatedData = data.map((item: unknown) =>
                RiskPredictionResponseSchema.parse(item)
            );

            return validatedData;
        } catch (error) {
            if (error instanceof XAIError) {
                throw error;
            }
            throw XAIError.fromUnknown(error);
        }
    }

    /**
     * Get model information
     */
    async getModelInfo() {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/model/info`);

            if (!response.ok) {
                throw new XAIError(`Failed to get model info: ${response.statusText}`, {
                    statusCode: response.status,
                });
            }

            return response.json();
        } catch (error) {
            if (error instanceof XAIError) {
                throw error;
            }
            throw XAIError.fromUnknown(error);
        }
    }
}

// Export singleton instance
export const xaiService = new XAIService();

// Export class for testing
export default XAIService;

// Re-export types from schemas
export type {
    HealthResponse,
    RiskFactor,
    RiskPredictionResponse,
    StudentRiskRequest
} from '../schemas/xai.schemas';

