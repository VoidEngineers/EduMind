import { useEngagementStore } from '@/store/engagementStore';
import { useCallback, useState } from 'react';
import { engagementService } from '../../services/engagementService';

export function useEngagementLogic() {
    const store = useEngagementStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        store.updateFormData({
            [name]: type === 'number' ? parseFloat(value) : value,
        });
    }, [store]);

    const handleSliderChange = useCallback((name: string, value: number[]) => {
        store.updateFormData({ [name]: value[0] });
    }, [store]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        store.setLoading(true);
        store.setError(null);

        try {
            const { result, interventions } = await engagementService.predictEngagement(store.formData);
            store.setResult(result);
            store.setInterventions(interventions);
            store.setActiveTab('results');
        } catch (error) {
            store.setError(error instanceof Error ? error.message : 'Prediction failed');
        } finally {
            setIsSubmitting(false);
            store.setLoading(false);
        }
    }, [store]);

    const handleReset = useCallback(() => {
        store.resetForm();
        store.clearResults();
        store.setActiveTab('form');
    }, [store]);

    const handleToggleIntervention = useCallback((id: string) => {
        store.toggleInterventionComplete(id);
    }, [store]);

    return {
        // State
        formData: store.formData,
        result: store.result,
        interventions: store.interventions,
        activeTab: store.activeTab,
        error: store.error,
        isLoading: store.isLoading,
        isSubmitting,
        progress: store.getInterventionProgress(),

        // Handlers
        handleInputChange,
        handleSliderChange,
        handleSubmit,
        handleReset,
        handleToggleIntervention
    };
}
