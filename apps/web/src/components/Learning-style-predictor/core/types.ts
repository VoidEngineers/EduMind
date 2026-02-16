/**
 * Core Types for Learning Style Predictor
 * Single source of truth for all type definitions
 */

export type LearningStyleType = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export type NoteTakingStyle = 'visual' | 'written' | 'audio' | 'mixed';
export type StudyEnvironment = 'quiet' | 'music' | 'group' | 'varies';
export type RetentionMethod = 'seeing' | 'hearing' | 'doing' | 'reading';

/**
 * Form data structure for learning style prediction
 */
export interface LearningStyleFormData {
    student_id: string;

    // Learning preferences (1-5 scale)
    prefers_diagrams: number;
    prefers_lectures: number;
    prefers_reading: number;
    prefers_hands_on: number;

    // Study habits
    note_taking_style: NoteTakingStyle;
    study_environment: StudyEnvironment;
    retention_method: RetentionMethod;

    // Time metrics (minutes per session)
    video_watch_time: number;
    reading_time: number;
    interactive_time: number;
}

/**
 * Learning style scores breakdown
 */
export interface LearningStyleScores {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
}

/**
 * Prediction result structure
 */
export interface LearningStyleResult {
    primary_style: LearningStyleType;
    secondary_style: LearningStyleType;
    style_scores: LearningStyleScores;
    confidence: number;
    recommendations: string[];
    timestamp: string;
}

/**
 * Filter configuration for results
 */
export interface LearningStyleFilters {
    styleType: LearningStyleType | null;
    confidenceThreshold: number;
}

/**
 * UI-specific types
 */
export type TabType = 'form' | 'results';

export interface LearningStyleUIState {
    activeTab: TabType;
    theme: 'light' | 'dark';
}
