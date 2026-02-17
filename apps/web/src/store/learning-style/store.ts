import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LearningStyleFilters, LearningStyleState } from './types';
import { INITIAL_FORM_DATA } from '@/components/Learning-style-predictor/core/constants';
import { DEFAULT_MAX_RECOMMENDATIONS } from '@/components/Learning-style-predictor/core/constants/uiConfig';

const INITIAL_STYLE_DISTRIBUTION = {
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0,
};

const INITIAL_FILTERS: LearningStyleFilters = {
    styleType: null,
    confidenceThreshold: 0,
};

export const useLearningStyleStore = create<LearningStyleState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                formData: INITIAL_FORM_DATA,
                result: null,
                isLoading: false,
                error: null,
                activeTab: 'form',
                theme: 'light',
                filters: INITIAL_FILTERS,
                workflowStep: 1,
                studentLookup: '',
                knownStudents: [],
                profile: null,
                isLoadingProfile: false,
                topicFilter: '',
                maxRecommendations: DEFAULT_MAX_RECOMMENDATIONS,
                systemStats: null,
                styleDistribution: INITIAL_STYLE_DISTRIBUTION,
                topStruggleTopics: [],
                isStudentListOpen: false,

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
                    set({ result: null, error: null }, false, 'clearResults'),

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

                // Filter actions
                updateFilters: (filters) =>
                    set(
                        (state) => ({
                            filters: { ...state.filters, ...filters },
                        }),
                        false,
                        'updateFilters'
                    ),

                resetFilters: () =>
                    set({ filters: INITIAL_FILTERS }, false, 'resetFilters'),

                // Workflow actions
                setWorkflowStep: (workflowStep) =>
                    set({ workflowStep }, false, 'setWorkflowStep'),

                setStudentLookup: (studentLookup) =>
                    set({ studentLookup }, false, 'setStudentLookup'),

                setKnownStudents: (knownStudents) =>
                    set({ knownStudents }, false, 'setKnownStudents'),

                setProfile: (profile) =>
                    set({ profile }, false, 'setProfile'),

                setIsLoadingProfile: (isLoadingProfile) =>
                    set({ isLoadingProfile }, false, 'setIsLoadingProfile'),

                setTopicFilter: (topicFilter) =>
                    set({ topicFilter }, false, 'setTopicFilter'),

                setMaxRecommendations: (maxRecommendations) =>
                    set({ maxRecommendations }, false, 'setMaxRecommendations'),

                setSystemStats: (systemStats) =>
                    set({ systemStats }, false, 'setSystemStats'),

                setStyleDistribution: (styleDistribution) =>
                    set({ styleDistribution }, false, 'setStyleDistribution'),

                setTopStruggleTopics: (topStruggleTopics) =>
                    set({ topStruggleTopics }, false, 'setTopStruggleTopics'),

                setStudentListOpen: (isStudentListOpen) =>
                    set({ isStudentListOpen }, false, 'setStudentListOpen'),

                resetWorkflowUi: () =>
                    set(
                        {
                            workflowStep: 1,
                            studentLookup: '',
                            knownStudents: [],
                            profile: null,
                            isLoadingProfile: false,
                            topicFilter: '',
                            maxRecommendations: DEFAULT_MAX_RECOMMENDATIONS,
                            systemStats: null,
                            styleDistribution: INITIAL_STYLE_DISTRIBUTION,
                            topStruggleTopics: [],
                            isStudentListOpen: false,
                        },
                        false,
                        'resetWorkflowUi'
                    ),
            }),
            {
                name: 'learning-style-storage',
                partialize: (state) => ({
                    formData: state.formData,
                    theme: state.theme,
                    studentLookup: state.studentLookup,
                }),
            }
        ),
        { name: 'LearningStyleStore' }
    )
);

// Selector hooks
export const useLearningStyleFormData = () => useLearningStyleStore((state) => state.formData);
export const useLearningStyleResult = () => useLearningStyleStore((state) => state.result);
