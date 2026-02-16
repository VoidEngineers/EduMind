import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LearningStyleFilters, LearningStyleFormData, LearningStyleState } from './types';

const INITIAL_FORM_DATA: LearningStyleFormData = {
    student_id: '',
    prefers_diagrams: 3,
    prefers_lectures: 3,
    prefers_reading: 3,
    prefers_hands_on: 3,
    note_taking_style: 'mixed',
    study_environment: 'varies',
    retention_method: 'seeing',
    video_watch_time: 30,
    reading_time: 30,
    interactive_time: 30,
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
            }),
            {
                name: 'learning-style-storage',
                partialize: (state) => ({
                    formData: state.formData,
                    theme: state.theme,
                }),
            }
        ),
        { name: 'LearningStyleStore' }
    )
);

// Selector hooks
export const useLearningStyleFormData = () => useLearningStyleStore((state) => state.formData);
export const useLearningStyleResult = () => useLearningStyleStore((state) => state.result);
