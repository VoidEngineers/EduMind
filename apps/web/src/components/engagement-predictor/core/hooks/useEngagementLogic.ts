/**
 * Engagement Logic Hook
 * Orchestrates form state, validation, and service calls
 * Decoupled from store implementation via state adapter
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { engagementSchema } from '../../schema';
import { engagementService as defaultService } from '../../services/engagementService';
import type { IEngagementService } from '../../services/interfaces';
import type { EngagementSchema } from '../types';
import { useEngagementState } from './useEngagementState';

/**
 * Hook configuration
 */
interface UseEngagementLogicConfig {
    service?: IEngagementService;
}

export function useEngagementLogic(config: UseEngagementLogicConfig = {}) {
    const { service = defaultService } = config;
    const state = useEngagementState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EngagementSchema>({
        resolver: zodResolver(engagementSchema),
        defaultValues: state.formData,
    });

    const onSubmit = useCallback(async (data: EngagementSchema) => {
        setIsSubmitting(true);
        state.actions.setLoading(true);
        state.actions.setError(null);

        try {
            // Update store with final data
            state.actions.setFormData(data);

            const { result, interventions } = await service.predictEngagement(data);
            state.actions.setResult(result);
            state.actions.setInterventions(interventions);
            state.actions.setActiveTab('results');
        } catch (error) {
            state.actions.setError(error instanceof Error ? error.message : 'Prediction failed');
        } finally {
            setIsSubmitting(false);
            state.actions.setLoading(false);
        }
    }, [state, service]);

    const handleReset = useCallback(() => {
        state.actions.resetForm();
        state.actions.clearResults();
        state.actions.setActiveTab('form');
        form.reset(state.formData);
    }, [state, form]);

    const handleToggleIntervention = useCallback((id: string) => {
        state.actions.toggleInterventionComplete(id);
    }, [state]);

    return {
        // Form RHF
        form,
        onSubmit: form.handleSubmit(onSubmit),

        // State (Legacy/Results)
        result: state.result,
        interventions: state.interventions,
        activeTab: state.activeTab,
        error: state.error,
        isLoading: state.isLoading,
        isSubmitting,
        progress: state.computed.interventionProgress,

        // Handlers
        handleReset,
        handleToggleIntervention
    };
}
