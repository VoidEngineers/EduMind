/**
 * XAI Prediction Repository
 * Persistence and caching for risk predictions
 */

import { LocalStorageRepository } from '@/lib/repository/Repository';
import type { RiskPredictionResponse } from '../../core/schemas/xai.schemas';

export interface StoredXAIPrediction extends RiskPredictionResponse {
    id?: string;
    studentId: string;
}

/**
 * Repository for XAI risk predictions
 */
export class XAIRepository extends LocalStorageRepository<StoredXAIPrediction> {
    constructor() {
        super('xai-predictions');
    }

    /**
     * Find predictions by student ID
     */
    async findByStudentId(studentId: string): Promise<StoredXAIPrediction[]> {
        return this.findAll({ studentId } as Partial<StoredXAIPrediction>);
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
    async findByRiskLevel(riskLevel: string): Promise<StoredXAIPrediction[]> {
        return this.findAll({ risk_level: riskLevel } as Partial<StoredXAIPrediction>);
    }

    /**
     * Get high-risk predictions
     */
    async getHighRiskPredictions(): Promise<StoredXAIPrediction[]> {
        return this.findByRiskLevel('At-Risk');
    }

    /**
     * Get predictions with risk score above threshold
     */
    async findByRiskScoreThreshold(threshold: number): Promise<StoredXAIPrediction[]> {
        const allPredictions = await this.findAll();
        return allPredictions.filter(prediction => prediction.risk_score >= threshold);
    }

    /**
     * Get student's risk trend (last N predictions)
     */
    async getRiskTrend(studentId: string, limit = 5): Promise<{
        studentId: string;
        trend: Array<{ timestamp: string; riskScore: number; riskLevel: string }>;
    }> {
        const history = await this.getHistory(studentId, limit);
        return {
            studentId,
            trend: history.map(pred => ({
                timestamp: pred.timestamp,
                riskScore: pred.risk_score,
                riskLevel: pred.risk_level,
            })),
        };
    }

    /**
     * Check if student has any high-risk predictions
     */
    async hasHighRiskHistory(studentId: string): Promise<boolean> {
        const predictions = await this.findByStudentId(studentId);
        return predictions.some(pred => pred.risk_level === 'At-Risk');
    }
}

// Singleton instance
export const xaiRepository = new XAIRepository();
