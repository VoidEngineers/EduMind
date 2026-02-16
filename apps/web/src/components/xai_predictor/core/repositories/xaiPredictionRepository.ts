/**
 * XAI Prediction Repository
 * Persistence and caching for XAI predictions
 */

import { LocalStorageRepository } from '@/lib/repository/Repository';
import type { RiskPredictionResponse } from '../schemas/xai.schemas';

export interface StoredXAIPrediction extends RiskPredictionResponse {
    id?: string;
}

/**
 * Repository for XAI predictions
 */
export class XAIPredictionRepository extends LocalStorageRepository<StoredXAIPrediction> {
    constructor() {
        super('xai-predictions');
    }

    /**
     * Find predictions by student ID
     */
    async findByStudentId(studentId: string): Promise<StoredXAIPrediction[]> {
        return this.findAll({ student_id: studentId } as Partial<StoredXAIPrediction>);
    }

    /**
     * Get latest prediction for a student
     */
    async getLatestForStudent(studentId: string): Promise<StoredXAIPrediction | null> {
        const predictions = await this.findByStudentId(studentId);
        if (predictions.length === 0) return null;

        return predictions.reduce((latest, current) =>
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
    }

    /**
     * Get prediction history for a student
     */
    async getHistory(studentId: string, limit = 10): Promise<StoredXAIPrediction[]> {
        const predictions = await this.findByStudentId(studentId);
        return predictions
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }

    /**
     * Get predictions by risk level
     */
    async findByRiskLevel(riskLevel: 'low' | 'medium' | 'high' | 'critical'): Promise<StoredXAIPrediction[]> {
        return this.findAll({ risk_level: riskLevel } as Partial<StoredXAIPrediction>);
    }
}

// Singleton instance
export const xaiPredictionRepository = new XAIPredictionRepository();
