/**
 * State Adapter Layer
 * Provides an abstraction layer between the Zustand store and components
 * Follows the Adapter pattern to decouple components from store implementation
 */

import { useEngagementStore } from '@/store/engagement';

/**
 * Hook that provides a clean state interface
 * Hides Zustand implementation details from components
 */
export function useEngagementState() {
    const store = useEngagementStore();

    return {
        // State selectors
        formData: store.formData,
        result: store.result,
        interventions: store.interventions,
        activeTab: store.activeTab,
        isLoading: store.isLoading,
        error: store.error,
        theme: store.theme,
        filters: store.filters,
        searchQuery: store.searchQuery,

        // Actions
        actions: {
            // Form actions
            updateFormData: store.updateFormData,
            setFormData: store.setFormData,
            resetForm: store.resetForm,

            // Result actions
            setResult: store.setResult,
            setLoading: store.setLoading,
            setError: store.setError,
            clearResults: store.clearResults,

            // Intervention actions
            addIntervention: store.addIntervention,
            removeIntervention: store.removeIntervention,
            toggleInterventionComplete: store.toggleInterventionComplete,
            setInterventions: store.setInterventions,

            // UI actions
            setActiveTab: store.setActiveTab,
            setTheme: store.setTheme,
            toggleTheme: store.toggleTheme,

            // Filter actions
            updateFilters: store.updateFilters,
            setSearchQuery: store.setSearchQuery,
            resetFilters: store.resetFilters,
        },

        // Computed
        computed: {
            interventionProgress: store.getInterventionProgress(),
            filteredInterventions: store.getFilteredInterventions(),
        },
    };
}

/**
 * Selector hooks for fine-grained subscriptions
 * Use these when components only need specific slices of state
 */

export function useFormData() {
    return useEngagementStore((state) => state.formData);
}

export function useResult() {
    return useEngagementStore((state) => state.result);
}

export function useInterventions() {
    return useEngagementStore((state) => state.interventions);
}

export function useActiveTab() {
    return useEngagementStore((state) => state.activeTab);
}

export function useIsLoading() {
    return useEngagementStore((state) => state.isLoading);
}

export function useError() {
    return useEngagementStore((state) => state.error);
}
