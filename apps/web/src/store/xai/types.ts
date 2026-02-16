import type { RiskPredictionResponse, StudentRiskRequest } from '@/components/xai_predictor/core/services/xaiService';

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'standard';
    category: 'academic' | 'engagement' | 'time-management' | 'support';
    isCompleted: boolean;
    isCustom?: boolean;
}

export interface XAIFilters {
    priorities: string[];
    categories: string[];
    showCompleted: boolean;
}

export interface NewActionItem {
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'standard';
    category: 'academic' | 'engagement' | 'time-management' | 'support';
}

export interface XAIState {
    // Form state
    formData: StudentRiskRequest;
    formDraft: StudentRiskRequest | null;

    // Prediction State
    currentPrediction: RiskPredictionResponse | null;

    // UI state
    isWhatIfModalOpen: boolean;
    isCustomActionModalOpen: boolean;
    isShareModalOpen: boolean;
    activeTab: string;
    searchQuery: string;
    shareLink: string;
    theme: 'light' | 'dark';

    // Custom action modal form state
    newActionItem: NewActionItem;

    // Action plan state
    actionPlan: ActionItem[];

    // Filters
    filters: XAIFilters;

    // Actions - Form
    updateFormData: (data: Partial<StudentRiskRequest>) => void;
    setFormData: (data: StudentRiskRequest | ((prev: StudentRiskRequest) => StudentRiskRequest)) => void;
    saveDraft: () => void;
    loadDraft: () => void;
    clearDraft: () => void;
    resetForm: () => void;

    // Actions - Prediction
    setCurrentPrediction: (prediction: RiskPredictionResponse | null) => void;

    // Actions - UI
    setWhatIfModalOpen: (isOpen: boolean) => void;
    setCustomActionModalOpen: (isOpen: boolean) => void;
    setShareModalOpen: (isOpen: boolean) => void;
    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setShareLink: (link: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;

    // Actions - Custom Action Modal Form
    updateNewActionItem: (field: keyof NewActionItem, value: string) => void;
    resetNewActionItem: () => void;
    submitNewAction: () => void;

    // Actions - Action Plan
    setActionPlan: (plan: ActionItem[]) => void;
    addAction: (action: Omit<ActionItem, 'id' | 'isCompleted'>) => void;
    removeAction: (id: string) => void;
    toggleActionComplete: (id: string) => void;
    clearActionPlan: () => void;

    // Actions - Filters
    updateFilters: (filters: Partial<XAIFilters>) => void;
    resetFilters: () => void;

    // Computed
    getProgress: () => number;
    getFilteredActions: () => ActionItem[];
}
