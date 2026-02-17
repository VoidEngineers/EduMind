/**
 * Learning Style Service Factory
 * Creates service instances with different configurations
 */

import type { ILearningStyleService } from '../data/interfaces';
import { learningStyleService } from './learningStyleService';

export type ServiceEnvironment = 'production' | 'development' | 'test';

export interface ServiceConfig {
    environment: ServiceEnvironment;
    mockDelay?: number;
    enableLogging?: boolean;
}

/**
 * Create a learning style service instance
 */
export function createLearningStyleService(config: ServiceConfig): ILearningStyleService {
    const { environment, mockDelay = 1500, enableLogging = false } = config;

    if (environment === 'test') {
        return createMockService(mockDelay); // Use mockDelay for tests
    }

    if (environment === 'development' && enableLogging) {
        return createLoggingService(learningStyleService);
    }

    // Default production service
    return learningStyleService;
}

/**
 * Create a mock service with configurable delay
 */
function createMockService(delay: number): ILearningStyleService {
    return {
        async predictLearningStyle(data) {
            await new Promise(resolve => setTimeout(resolve, delay));

            return {
                primary_style: 'visual',
                secondary_style: 'kinesthetic',
                style_scores: {
                    visual: 85,
                    auditory: 60,
                    reading: 70,
                    kinesthetic: 75,
                },
                confidence: 85,
                recommendations: [
                    'Use diagrams and visual aids',
                    'Watch video tutorials',
                    'Practice hands-on exercises',
                ],
                timestamp: new Date().toISOString(),
            };
        },
        async checkHealth() {
            return { status: 'healthy', message: 'Mock service operational' };
        },
    };
}

/**
 * Create a service wrapper with logging
 */
function createLoggingService(service: ILearningStyleService): ILearningStyleService {
    return {
        async predictLearningStyle(data) {
            console.log('[LearningStyleService] Predicting for:', data.student_id);
            const start = Date.now();

            try {
                const result = await service.predictLearningStyle(data);
                const duration = Date.now() - start;
                console.log(`[LearningStyleService] Prediction completed in ${duration}ms`);
                return result;
            } catch (error) {
                console.error('[LearningStyleService] Prediction failed:', error);
                throw error;
            }
        },
        async checkHealth() {
            console.log('[LearningStyleService] Health check');
            return service.checkHealth();
        },
    };
}

// Default service instance
export const defaultLearningStyleService = createLearningStyleService({
    environment: import.meta.env.MODE === 'test' ? 'test' : 'production',
    enableLogging: import.meta.env.DEV,
});
