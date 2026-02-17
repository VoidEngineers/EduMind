/**
 * Learning Style Result Repository
 * Persistence and caching for predictions
 */

import { LocalStorageRepository } from '@/lib/repository/Repository';
import type { LearningStyleResult } from '../../core/types';

export interface StoredLearningStyleResult extends LearningStyleResult {
    id?: string;
    studentId: string;
}

/**
 * Repository for learning style predictions
 */
export class LearningStyleRepository extends LocalStorageRepository<StoredLearningStyleResult> {
    constructor() {
        super('learning-style-predictions');
    }

    /**
     * Find predictions by student ID
     */
    async findByStudentId(studentId: string): Promise<StoredLearningStyleResult[]> {
        return this.findAll({ studentId } as Partial<StoredLearningStyleResult>);
    }

    /**
     * Get latest prediction for a student
     */
    async getLatestForStudent(studentId: string): Promise<StoredLearningStyleResult | null> {
        const predictions = await this.findByStudentId(studentId);
        if (predictions.length === 0) return null;

        return predictions.reduce((latest, current) =>
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
    }

    /**
     * Get prediction history for a student
     */
    async getHistory(studentId: string, limit = 10): Promise<StoredLearningStyleResult[]> {
        const predictions = await this.findByStudentId(studentId);
        return predictions
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
}

// Singleton instance
export const learningStyleRepository = new LearningStyleRepository();
