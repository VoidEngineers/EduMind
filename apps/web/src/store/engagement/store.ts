import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { EngagementFilters, EngagementFormData, EngagementState } from './types';

const INITIAL_FORM_DATA: EngagementFormData = {
    student_id: '',
    login_frequency: 5,
    session_duration: 30,
    page_views: 10,
    assignments_completed: 80,
    assignments_on_time: 75,
    quiz_attempts: 1,
    quiz_scores: 70,
    forum_posts: 2,
    forum_replies: 3,
    group_participation: 3,
    video_completion_rate: 70,
    resource_downloads: 5,
    time_on_task: 300,
};

const INITIAL_FILTERS: EngagementFilters = {
    engagementLevel: null,
    riskFactorCount: 0,
    showCompleted: true,
};

export const useEngagementStore = create<EngagementState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                formData: INITIAL_FORM_DATA,
                result: null,
                isLoading: false,
                error: null,
                interventions: [],
                activeTab: 'form',
                theme: 'light',
                isCompareModalOpen: false,
                filters: INITIAL_FILTERS,
                searchQuery: '',

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

                resetForm: () =>
                    set({ formData: INITIAL_FORM_DATA }, false, 'resetForm'),

                // Results actions
                setResult: (result) =>
                    set({ result }, false, 'setResult'),

                setLoading: (isLoading) =>
                    set({ isLoading }, false, 'setLoading'),

                setError: (error) =>
                    set({ error }, false, 'setError'),

                clearResults: () =>
                    set({ result: null, error: null, interventions: [] }, false, 'clearResults'),

                // Intervention actions
                addIntervention: (intervention) =>
                    set(
                        (state) => ({
                            interventions: [
                                ...state.interventions,
                                { ...intervention, id: Date.now().toString(), isCompleted: false },
                            ],
                        }),
                        false,
                        'addIntervention'
                    ),

                removeIntervention: (id) =>
                    set(
                        (state) => ({
                            interventions: state.interventions.filter((i) => i.id !== id),
                        }),
                        false,
                        'removeIntervention'
                    ),

                toggleInterventionComplete: (id) =>
                    set(
                        (state) => ({
                            interventions: state.interventions.map((i) =>
                                i.id === id ? { ...i, isCompleted: !i.isCompleted } : i
                            ),
                        }),
                        false,
                        'toggleInterventionComplete'
                    ),

                setInterventions: (interventions) =>
                    set({ interventions }, false, 'setInterventions'),

                // UI actions
                setActiveTab: (activeTab) =>
                    set({ activeTab }, false, 'setActiveTab'),

                setTheme: (theme) =>
                    set({ theme }, false, 'setTheme'),

                toggleTheme: () =>
                    set(
                        (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
                        false,
                        'toggleTheme'
                    ),

                setCompareModalOpen: (isCompareModalOpen) =>
                    set({ isCompareModalOpen }, false, 'setCompareModalOpen'),

                // Filter actions
                updateFilters: (filters) =>
                    set(
                        (state) => ({
                            filters: { ...state.filters, ...filters },
                        }),
                        false,
                        'updateFilters'
                    ),

                setSearchQuery: (searchQuery) =>
                    set({ searchQuery }, false, 'setSearchQuery'),

                resetFilters: () =>
                    set({ filters: INITIAL_FILTERS, searchQuery: '' }, false, 'resetFilters'),

                // Computed
                getInterventionProgress: () => {
                    const { interventions } = get();
                    if (interventions.length === 0) return 0;
                    return Math.round(
                        (interventions.filter((i) => i.isCompleted).length / interventions.length) * 100
                    );
                },

                getFilteredInterventions: () => {
                    const { interventions, filters, searchQuery } = get();
                    return interventions.filter((intervention) => {
                        if (!filters.showCompleted && intervention.isCompleted) return false;
                        if (searchQuery) {
                            const query = searchQuery.toLowerCase();
                            return (
                                intervention.title.toLowerCase().includes(query) ||
                                intervention.description.toLowerCase().includes(query)
                            );
                        }
                        return true;
                    });
                },
            }),
            {
                name: 'engagement-storage',
                partialize: (state) => ({
                    formData: state.formData,
                    interventions: state.interventions,
                    theme: state.theme,
                }),
            }
        ),
        { name: 'EngagementStore' }
    )
);

// Selector hooks
export const useEngagementFormData = () => useEngagementStore((state) => state.formData);
export const useEngagementResult = () => useEngagementStore((state) => state.result);
export const useInterventions = () => useEngagementStore((state) => state.interventions);
