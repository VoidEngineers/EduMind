/**
 * Learning Style Prediction Service
 * Mock service for learning style predictions
 */

import type { LearningStyleFormData, LearningStyleResult, LearningStyleType } from '../core/types';
import type { HealthCheckResponse, ILearningStyleService } from '../data/interfaces';


// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate learning style based on form data
 */
function calculateLearningStyle(data: LearningStyleFormData): LearningStyleResult {
    // Calculate style scores based on preferences and behaviors
    const visual =
        data.prefers_diagrams * 20 +
        (data.note_taking_style === 'visual' ? 25 : 0) +
        (data.retention_method === 'seeing' ? 25 : 0) +
        (data.video_watch_time / 60) * 10;

    const auditory =
        data.prefers_lectures * 20 +
        (data.note_taking_style === 'audio' ? 25 : 0) +
        (data.retention_method === 'hearing' ? 25 : 0) +
        (data.study_environment === 'music' ? 15 : 0);

    const reading =
        data.prefers_reading * 20 +
        (data.note_taking_style === 'written' ? 25 : 0) +
        (data.retention_method === 'reading' ? 25 : 0) +
        (data.reading_time / 60) * 10;

    const kinesthetic =
        data.prefers_hands_on * 20 +
        (data.retention_method === 'doing' ? 25 : 0) +
        (data.interactive_time / 60) * 10 +
        (data.study_environment === 'group' ? 15 : 0);

    // Normalize scores to 0-100
    const maxPossible = 100;
    const scores = {
        visual: Math.min(100, Math.round((visual / maxPossible) * 100)),
        auditory: Math.min(100, Math.round((auditory / maxPossible) * 100)),
        reading: Math.min(100, Math.round((reading / maxPossible) * 100)),
        kinesthetic: Math.min(100, Math.round((kinesthetic / maxPossible) * 100)),
    };

    // Determine primary and secondary styles
    type NonNullableStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    const sortedStyles = Object.entries(scores)
        .sort(([, a], [, b]) => b - a) as [NonNullableStyle, number][];

    const primary_style: LearningStyleType = sortedStyles[0][0];
    const secondary_style: LearningStyleType = sortedStyles[1][0];

    // Calculate confidence based on score difference
    const confidence = Math.min(95, 60 + (sortedStyles[0][1] - sortedStyles[1][1]));

    // Generate recommendations
    const recommendations = generateRecommendations(primary_style, secondary_style);

    return {
        primary_style,
        secondary_style,
        style_scores: scores,
        confidence,
        recommendations,
        timestamp: new Date().toISOString(),
    };
}

function generateRecommendations(primary: LearningStyleType, secondary: LearningStyleType): string[] {
    const recs: Record<string, string[]> = {
        visual: [
            'Use mind maps and diagrams to organize information',
            'Watch video tutorials and demonstrations',
            'Color-code notes and use highlighters',
            'Create flowcharts for complex processes',
        ],
        auditory: [
            'Record lectures and listen to them again',
            'Join study groups for discussions',
            'Use text-to-speech for reading materials',
            'Explain concepts out loud to yourself',
        ],
        reading: [
            'Take detailed written notes during lectures',
            'Read textbooks and research papers',
            'Create written summaries of key concepts',
            'Use flashcards with written definitions',
        ],
        kinesthetic: [
            'Take frequent breaks during study sessions',
            'Use hands-on experiments and simulations',
            'Walk while reviewing materials',
            'Build models or create physical representations',
        ],
    };

    const primaryRecs = primary ? recs[primary] || [] : [];
    const secondaryRecs = secondary ? recs[secondary] || [] : [];

    return [...primaryRecs.slice(0, 3), ...secondaryRecs.slice(0, 1)];
}

export const learningStyleService: ILearningStyleService = {
    /**
     * Predict learning style based on student data
     */
    async predictLearningStyle(data: LearningStyleFormData): Promise<LearningStyleResult> {
        // Simulate API call
        await delay(1500);

        // Validate input
        if (!data.student_id) {
            throw new Error('Student ID is required');
        }

        return calculateLearningStyle(data);
    },

    /**
     * Check if service is healthy
     */
    async checkHealth(): Promise<HealthCheckResponse> {
        await delay(200);
        return { status: 'healthy', message: 'Learning Style Prediction service is operational' };
    },
};
