/**
 * Learning Style Service Factory
 * Creates service instances with different configurations
 */

import type { ILearningStyleDashboardService } from '../data/interfaces';
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
export function createLearningStyleService(config: ServiceConfig): ILearningStyleDashboardService {
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
function createMockService(delay: number): ILearningStyleDashboardService {
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
        async listStudentIds() {
            return ['STU0001', 'STU0002', 'STU0003', 'STU0004'];
        },
        async getStudentProfile(studentId: string) {
            return {
                studentId,
                completionRate: 78,
                daysTracked: 14,
                preferredDifficulty: 'Standard' as const,
            };
        },
        async getSystemStats() {
            return {
                totalStudents: 16,
                totalResources: 42,
                totalRecommendations: 128,
                recommendationCompletionRate: 82,
                learningStyleDistribution: {
                    visual: 5,
                    auditory: 3,
                    reading: 4,
                    kinesthetic: 4,
                },
                topStruggleTopics: [
                    { label: 'Linear Algebra', count: 11 },
                    { label: 'Python Loops', count: 9 },
                    { label: 'Data Structures', count: 8 },
                    { label: 'Probability Basics', count: 7 },
                    { label: 'Database Joins', count: 6 },
                ],
            };
        },
    };
}

/**
 * Create a service wrapper with logging
 */
function createLoggingService(service: ILearningStyleDashboardService): ILearningStyleDashboardService {
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
        async listStudentIds(limit) {
            console.log('[LearningStyleService] Fetching student IDs');
            return service.listStudentIds(limit);
        },
        async getStudentProfile(studentId) {
            console.log('[LearningStyleService] Fetching student profile:', studentId);
            return service.getStudentProfile(studentId);
        },
        async getSystemStats() {
            console.log('[LearningStyleService] Fetching system stats');
            return service.getSystemStats();
        },
    };
}

// Default service instance
export const defaultLearningStyleService = createLearningStyleService({
    environment: import.meta.env.MODE === 'test' ? 'test' : 'production',
    enableLogging: import.meta.env.DEV,
});
