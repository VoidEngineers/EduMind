import type {
    LearningStyleFilters,
    LearningStyleFormData,
    LearningStyleResult,
    LearningStyleType,
    TabType,
} from '@/components/Learning-style-predictor/core/types';
import type { StruggleTopicData, StudentProfileSummaryData } from '@/components/Learning-style-predictor/data/interfaces';

export type {
    LearningStyleFilters,
    LearningStyleFormData,
    LearningStyleResult,
    LearningStyleType,
};

export interface LearningStyleState {
    // Form state
    formData: LearningStyleFormData;

    // Results
    result: LearningStyleResult | null;
    isLoading: boolean;
    error: string | null;

    // UI state
    activeTab: TabType;
    theme: 'light' | 'dark';

    // Filters
    filters: LearningStyleFilters;

    // Workflow state
    workflowStep: 1 | 2 | 3;
    studentLookup: string;
    knownStudents: string[];
    profile: StudentProfileSummaryData | null;
    isLoadingProfile: boolean;
    topicFilter: string;
    maxRecommendations: number;
    styleDistribution: Record<LearningStyleType, number>;
    topStruggleTopics: StruggleTopicData[];
    isStudentListOpen: boolean;

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
    setActiveTab: (tab: TabType) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;

    // Actions - Filters
    updateFilters: (filters: Partial<LearningStyleFilters>) => void;
    resetFilters: () => void;

    // Actions - Workflow
    setWorkflowStep: (step: 1 | 2 | 3) => void;
    setStudentLookup: (value: string) => void;
    setKnownStudents: (students: string[]) => void;
    setProfile: (profile: StudentProfileSummaryData | null) => void;
    setIsLoadingProfile: (loading: boolean) => void;
    setTopicFilter: (value: string) => void;
    setMaxRecommendations: (value: number) => void;
    setStyleDistribution: (distribution: Record<LearningStyleType, number>) => void;
    setTopStruggleTopics: (topics: StruggleTopicData[]) => void;
    setStudentListOpen: (open: boolean) => void;
    resetWorkflowUi: () => void;
}
