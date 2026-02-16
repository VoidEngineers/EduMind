/**
 * Learning Style State Adapter Hook
 * Abstracts state management implementation (Zustand) from business logic
 */

import { INITIAL_FORM_DATA } from '../constants';
import type { LearningStyleFormData, LearningStyleResult } from '../types';
import { useLearningStyleStore } from '@/store/learning-style';

/**
 * State adapter interface
 * Defines the contract for state management
 */
export interface LearningStyleStateAdapter {
    // State
    formData: LearningStyleFormData;
    result: LearningStyleResult | null;
    isLoading: boolean;
    error: string | null;
    activeTab: string;

    // Actions
    setFormData: (data: LearningStyleFormData) => void;
    setResult: (result: LearningStyleResult | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setActiveTab: (tab: string) => void;
    resetForm: () => void;
    clearResults: () => void;
}

/**
 * Hook that adapts Zustand store to state adapter interface
 * This allows swapping state management without changing business logic
 */
export function useLearningStyleState(): LearningStyleStateAdapter {
    const store = useLearningStyleStore();

    return {
        // State
        formData: store.formData,
        result: store.result,
        isLoading: store.isLoading,
        error: store.error,
        activeTab: store.activeTab,

        // Actions
        setFormData: store.setFormData,
        setResult: store.setResult,
        setLoading: store.setLoading,
        setError: store.setError,
        setActiveTab: store.setActiveTab,
        resetForm: store.resetForm,
        clearResults: store.clearResults,
    };
}

/**
 * Get initial form data
 * Can be overridden for testing
 */
export function getInitialFormData(): LearningStyleFormData {
    return { ...INITIAL_FORM_DATA };
}
