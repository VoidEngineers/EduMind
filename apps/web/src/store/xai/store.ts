import type { StudentRiskRequest } from '@/components/xai_predictor/core/services/xaiService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { NewActionItem, XAIFilters, XAIState } from './types';

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

const INITIAL_NEW_ACTION_ITEM: NewActionItem = {
    title: '',
    description: '',
    priority: 'standard',
    category: 'academic',
};

export const useXAIStore = create<XAIState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                formData: INITIAL_FORM_DATA,
                formDraft: null,
                currentPrediction: null,
                isWhatIfModalOpen: false,
                isCustomActionModalOpen: false,
                isShareModalOpen: false,
                activeTab: 'overview',
                searchQuery: '',
                shareLink: '',
                theme: 'light',
                newActionItem: INITIAL_NEW_ACTION_ITEM,
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
                    set(
                        (state) => ({
                            formData: typeof data === 'function' ? data(state.formData) : data,
                        }),
                        false,
                        'setFormData'
                    ),

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
                        { formData: INITIAL_FORM_DATA, formDraft: null, currentPrediction: null },
                        false,
                        'resetForm'
                    ),

                // Prediction actions
                setCurrentPrediction: (prediction) =>
                    set({ currentPrediction: prediction }, false, 'setCurrentPrediction'),

                // UI actions
                setWhatIfModalOpen: (isOpen) => {
                    console.log('[Zustand Store] setWhatIfModalOpen called with:', isOpen);
                    set({ isWhatIfModalOpen: isOpen }, false, 'setWhatIfModalOpen');
                    console.log('[Zustand Store] State after set:', isOpen);
                },

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

                setShareModalOpen: (isOpen) =>
                    set({ isShareModalOpen: isOpen }, false, 'setShareModalOpen'),

                setShareLink: (link) =>
                    set({ shareLink: link }, false, 'setShareLink'),

                setTheme: (theme) =>
                    set({ theme }, false, 'setTheme'),

                toggleTheme: () =>
                    set(
                        (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
                        false,
                        'toggleTheme'
                    ),

                // Custom action modal form actions
                updateNewActionItem: (field, value) =>
                    set(
                        (state) => ({
                            newActionItem: { ...state.newActionItem, [field]: value },
                        }),
                        false,
                        'updateNewActionItem'
                    ),

                resetNewActionItem: () =>
                    set({ newActionItem: INITIAL_NEW_ACTION_ITEM }, false, 'resetNewActionItem'),

                submitNewAction: () => {
                    const { newActionItem, addAction } = get();
                    if (newActionItem.title.trim()) {
                        addAction({
                            title: newActionItem.title,
                            description: newActionItem.description,
                            priority: newActionItem.priority,
                            category: newActionItem.category,
                        });
                        set({
                            newActionItem: INITIAL_NEW_ACTION_ITEM,
                            isCustomActionModalOpen: false,
                        }, false, 'submitNewAction');
                    }
                },

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
                // Merge persisted state with initial state to handle missing fields
                merge: (persistedState, currentState) => {
                    const persisted = persistedState as Partial<XAIState> | undefined;
                    return {
                        ...currentState,
                        ...persisted,
                        // Ensure formData always has all fields by merging with INITIAL_FORM_DATA
                        formData: {
                            ...INITIAL_FORM_DATA,
                            ...(persisted?.formData || {}),
                        },
                        // Ensure filters have all fields
                        filters: {
                            ...INITIAL_FILTERS,
                            ...(persisted?.filters || {}),
                        },
                        // Ensure newActionItem has all fields
                        newActionItem: {
                            ...INITIAL_NEW_ACTION_ITEM,
                            ...(persisted?.newActionItem || {}),
                        },
                    };
                },
            }
        ),
        { name: 'XAIStore' }
    )
);

// Helper hooks for common use cases
export const useFormData = () => useXAIStore((state) => state.formData);
export const useActionPlan = () => useXAIStore((state) => state.actionPlan);
export const useXAIFilters = () => useXAIStore((state) => state.filters);
