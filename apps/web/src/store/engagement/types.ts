export type EngagementLevel = 'highly_engaged' | 'engaged' | 'at_risk' | 'disengaged' | null;

export interface EngagementFormData {
    student_id: string;
    // Activity metrics
    login_frequency: number; // logins per week
    session_duration: number; // average minutes per session
    page_views: number; // average per session
    // Academic engagement
    assignments_completed: number; // percentage 0-100
    assignments_on_time: number; // percentage 0-100
    quiz_attempts: number; // average attempts per quiz
    quiz_scores: number; // average percentage
    // Social engagement
    forum_posts: number; // posts per week
    forum_replies: number; // replies per week
    group_participation: number; // 1-5 scale
    // Content interaction
    video_completion_rate: number; // percentage
    resource_downloads: number; // per week
    time_on_task: number; // minutes per week
}

export interface EngagementResult {
    engagement_level: EngagementLevel;
    engagement_score: number; // 0-100
    risk_factors: string[];
    strengths: string[];
    trend: 'improving' | 'stable' | 'declining';
    recommendations: string[];
    detailed_scores: {
        academic: number;
        social: number;
        behavioral: number;
        content: number;
    };
    timestamp: string;
}

export interface InterventionItem {
    id: string;
    title: string;
    description: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    category: 'academic' | 'social' | 'motivational' | 'technical';
    isCompleted: boolean;
}

export interface EngagementFilters {
    engagementLevel: EngagementLevel;
    riskFactorCount: number;
    showCompleted: boolean;
}

export interface EngagementState {
    // Form state
    formData: EngagementFormData;

    // Results
    result: EngagementResult | null;
    isLoading: boolean;
    error: string | null;

    // Interventions
    interventions: InterventionItem[];

    // UI state
    activeTab: string;
    theme: 'light' | 'dark';
    isCompareModalOpen: boolean;

    // Filters
    filters: EngagementFilters;
    searchQuery: string;

    // Actions - Form
    updateFormData: (data: Partial<EngagementFormData>) => void;
    setFormData: (data: EngagementFormData | ((prev: EngagementFormData) => EngagementFormData)) => void;
    resetForm: () => void;

    // Actions - Results
    setResult: (result: EngagementResult | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearResults: () => void;

    // Actions - Interventions
    addIntervention: (intervention: Omit<InterventionItem, 'id' | 'isCompleted'>) => void;
    removeIntervention: (id: string) => void;
    toggleInterventionComplete: (id: string) => void;
    setInterventions: (interventions: InterventionItem[]) => void;

    // Actions - UI
    setActiveTab: (tab: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
    setCompareModalOpen: (open: boolean) => void;

    // Actions - Filters
    updateFilters: (filters: Partial<EngagementFilters>) => void;
    setSearchQuery: (query: string) => void;
    resetFilters: () => void;

    // Computed
    getInterventionProgress: () => number;
    getFilteredInterventions: () => InterventionItem[];
}
