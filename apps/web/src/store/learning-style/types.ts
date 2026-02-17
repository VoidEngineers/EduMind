export type LearningStyleType = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export interface LearningStyleFormData {
    student_id: string;
    // Learning preferences
    prefers_diagrams: number; // 1-5 scale
    prefers_lectures: number;
    prefers_reading: number;
    prefers_hands_on: number;
    // Study habits
    note_taking_style: 'visual' | 'written' | 'audio' | 'mixed';
    study_environment: 'quiet' | 'music' | 'group' | 'varies';
    retention_method: 'seeing' | 'hearing' | 'doing' | 'reading';
    // Engagement patterns
    video_watch_time: number; // minutes per session
    reading_time: number;
    interactive_time: number;
}

export interface LearningStyleResult {
    primary_style: LearningStyleType;
    secondary_style: LearningStyleType;
    style_scores: {
        visual: number;
        auditory: number;
        reading: number;
        kinesthetic: number;
    };
    confidence: number;
    recommendations: string[];
    timestamp: string;
}

export interface LearningStyleFilters {
    styleType: LearningStyleType | null;
    confidenceThreshold: number;
}

export interface LearningStyleState {
    // Form state
    formData: LearningStyleFormData;

    // Results
    result: LearningStyleResult | null;
    isLoading: boolean;
    error: string | null;

    // UI state
    activeTab: string;
    theme: 'light' | 'dark';

    // Filters
    filters: LearningStyleFilters;

    // Actions - Form
    updateFormData: (data: Partial<LearningStyleFormData>) => void;
    setFormData: (data: LearningStyleFormData | ((prev: LearningStyleFormData) => LearningStyleFormData)) => void;
    resetForm: () => void;

    // Actions - Results
    setResult: (result: LearningStyleResult | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearResults: () => void;

    // Actions - UI
    setActiveTab: (tab: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;

    // Actions - Filters
    updateFilters: (filters: Partial<LearningStyleFilters>) => void;
    resetFilters: () => void;
}
