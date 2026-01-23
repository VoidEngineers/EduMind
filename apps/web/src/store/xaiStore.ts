import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StudentRiskRequest } from '../components/xai_predictor/core/services/xaiService';

// Types
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

interface XAIState {
    // Form state
    formData: StudentRiskRequest;
    formDraft: StudentRiskRequest | null;

    // UI state
    isWhatIfModalOpen: boolean;
    isCustomActionModalOpen: boolean;
    activeTab: string;
    searchQuery: string;

    // Action plan state
    actionPlan: ActionItem[];

    // Filters
    filters: XAIFilters;

    // Actions - Form
    updateFormData: (data: Partial<StudentRiskRequest>) => void;
    setFormData: (data: StudentRiskRequest) => void;
    saveDraft: () => void;
    loadDraft: () => void;
    clearDraft: () => void;
    resetForm: () => void;

    // Actions - UI
    setWhatIfModalOpen: (isOpen: boolean) => void;
    setCustomActionModalOpen: (isOpen: boolean) => void;
    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;

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

const INITIAL_FORM_DATA: StudentRiskRequest = {
    student_id: '',
    avg_grade: 70,
    grade_consistency: 85,
    grade_range: 30,
    num_assessments: 8,
    assessment_completion_rate: 0.8,
    studied_credits: 60,
    num_of_prev_attempts: 0,
    low_performance: 0,
    low_engagement: 0,
    has_previous_attempts: 0,
};

const INITIAL_FILTERS: XAIFilters = {
    priorities: [],
    categories: [],
    showCompleted: true,
};

export const useXAIStore = create<XAIState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                formData: INITIAL_FORM_DATA,
                formDraft: null,
                isWhatIfModalOpen: false,
                isCustomActionModalOpen: false,
                activeTab: 'overview',
                searchQuery: '',
                actionPlan: [],
                filters: INITIAL_FILTERS,

                // Form actions
                updateFormData: (data) =>
                    set(
                        (state) => ({
                            formData: { ...state.formData, ...data },
                        }),
                        false,
                        'updateFormData'
                    ),

                setFormData: (data) =>
                    set({ formData: data }, false, 'setFormData'),

                saveDraft: () =>
                    set(
                        (state) => ({ formDraft: state.formData }),
                        false,
                        'saveDraft'
                    ),

                loadDraft: () =>
                    set(
                        (state) => ({
                            formData: state.formDraft || INITIAL_FORM_DATA,
                        }),
                        false,
                        'loadDraft'
                    ),

                clearDraft: () =>
                    set({ formDraft: null }, false, 'clearDraft'),

                resetForm: () =>
                    set(
                        { formData: INITIAL_FORM_DATA, formDraft: null },
                        false,
                        'resetForm'
                    ),

                // UI actions
                setWhatIfModalOpen: (isOpen) =>
                    set({ isWhatIfModalOpen: isOpen }, false, 'setWhatIfModalOpen'),

                setCustomActionModalOpen: (isOpen) =>
                    set(
                        { isCustomActionModalOpen: isOpen },
                        false,
                        'setCustomActionModalOpen'
                    ),

                setActiveTab: (tab) =>
                    set({ activeTab: tab }, false, 'setActiveTab'),

                setSearchQuery: (query) =>
                    set({ searchQuery: query }, false, 'setSearchQuery'),

                // Action plan actions
                setActionPlan: (plan) =>
                    set({ actionPlan: plan }, false, 'setActionPlan'),

                addAction: (action) =>
                    set(
                        (state) => ({
                            actionPlan: [
                                ...state.actionPlan,
                                {
                                    ...action,
                                    id: crypto.randomUUID(),
                                    isCompleted: false,
                                    isCustom: true,
                                },
                            ],
                        }),
                        false,
                        'addAction'
                    ),

                removeAction: (id) =>
                    set(
                        (state) => ({
                            actionPlan: state.actionPlan.filter((a) => a.id !== id),
                        }),
                        false,
                        'removeAction'
                    ),

                toggleActionComplete: (id) =>
                    set(
                        (state) => ({
                            actionPlan: state.actionPlan.map((a) =>
                                a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
                            ),
                        }),
                        false,
                        'toggleActionComplete'
                    ),

                clearActionPlan: () =>
                    set({ actionPlan: [] }, false, 'clearActionPlan'),

                // Filter actions
                updateFilters: (newFilters) =>
                    set(
                        (state) => ({
                            filters: { ...state.filters, ...newFilters },
                        }),
                        false,
                        'updateFilters'
                    ),

                resetFilters: () =>
                    set({ filters: INITIAL_FILTERS }, false, 'resetFilters'),

                // Computed values
                getProgress: () => {
                    const { actionPlan } = get();
                    if (actionPlan.length === 0) return 0;
                    const completed = actionPlan.filter((a) => a.isCompleted).length;
                    return Math.round((completed / actionPlan.length) * 100);
                },

                getFilteredActions: () => {
                    const { actionPlan, filters, searchQuery } = get();

                    return actionPlan.filter((action) => {
                        // Filter by completion status
                        if (!filters.showCompleted && action.isCompleted) return false;

                        // Filter by priority
                        if (
                            filters.priorities.length > 0 &&
                            !filters.priorities.includes(action.priority)
                        ) {
                            return false;
                        }

                        // Filter by category
                        if (
                            filters.categories.length > 0 &&
                            !filters.categories.includes(action.category)
                        ) {
                            return false;
                        }

                        // Filter by search query
                        if (searchQuery) {
                            const query = searchQuery.toLowerCase();
                            return (
                                action.title.toLowerCase().includes(query) ||
                                action.description.toLowerCase().includes(query)
                            );
                        }

                        return true;
                    });
                },
            }),
            {
                name: 'xai-storage',
                partialize: (state) => ({
                    formDraft: state.formDraft,
                    actionPlan: state.actionPlan,
                    filters: state.filters,
                }),
            }
        ),
        { name: 'XAIStore' }
    )
);

// Helper hooks for common use cases
export const useFormData = () => useXAIStore((state) => state.formData);
export const useActionPlan = () => useXAIStore((state) => state.actionPlan);
export const useXAIFilters = () => useXAIStore((state) => state.filters);
