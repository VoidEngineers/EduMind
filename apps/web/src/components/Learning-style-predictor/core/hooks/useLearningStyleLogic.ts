/**
 * Learning Style Logic Hook
 * Core business logic with dependency injection support
 * Enhanced with state machine, error handling, events, and persistence
 */

import { PredictionError, PredictionErrorType, ValidationError } from '@/components/common/errors/PredictionError';
import type { LoadingState } from '@/components/common/types/LoadingState';
import { LOADING_STATES } from '@/components/common/types/LoadingState';
import { PREDICTION_EVENTS, eventBus, type PredictionErrorEvent, type PredictionStartedEvent, type PredictionSuccessEvent } from '@/lib/events/eventBus';
import { useCallback, useState } from 'react';
import type { ILearningStyleService } from '../../data/interfaces';
import { learningStyleRepository, type StoredLearningStyleResult } from '../../data/repositories/learningStyleRepository';
import type { LearningStyleFormData } from '../types';
import type { LearningStyleStateAdapter } from './useLearningStyleState';

export interface UseLearningStyleLogicProps {
    service: ILearningStyleService;
    state: LearningStyleStateAdapter;
    enablePersistence?: boolean;
    enableEvents?: boolean;
}

export interface UseLearningStyleLogicReturn {
    handleSubmit: (data: LearningStyleFormData) => Promise<void>;
    handleReset: () => void;
    loadingState: LoadingState;
    loadHistory: (studentId: string) => Promise<StoredLearningStyleResult[]>;
}

/**
 * Core business logic hook
 * Accepts dependencies through props for better testability
 */
export function useLearningStyleLogic({
    service,
    state,
    enablePersistence = true,
    enableEvents = true,
}: UseLearningStyleLogicProps): UseLearningStyleLogicReturn {

    const [loadingState, setLoadingState] = useState<LoadingState>(LOADING_STATES.IDLE);

    const handleSubmit = useCallback(async (data: LearningStyleFormData) => {
        const startTime = Date.now();

        try {
            // Validate
            setLoadingState(LOADING_STATES.VALIDATING);
            state.setLoading(true);
            state.setError(null);

            if (!data.student_id) {
                throw new ValidationError('Student ID is required');
            }

            // Emit start event
            if (enableEvents) {
                await eventBus.emit<PredictionStartedEvent>(PREDICTION_EVENTS.STARTED, {
                    type: 'learning-style',
                    timestamp: new Date().toISOString(),
                    studentId: data.student_id,
                });
            }

            // Update state with form data
            state.setFormData(data);

            // Submit prediction
            setLoadingState(LOADING_STATES.SUBMITTING);
            const result = await service.predictLearningStyle(data);

            // Save to repository if enabled
            if (enablePersistence) {
                await learningStyleRepository.save({
                    ...result,
                    studentId: data.student_id,
                });
            }

            // Update state with results
            state.setResult(result);
            state.setActiveTab('results');
            setLoadingState(LOADING_STATES.SUCCESS);

            // Emit success event
            if (enableEvents) {
                await eventBus.emit<PredictionSuccessEvent>(PREDICTION_EVENTS.SUCCESS, {
                    type: 'learning-style',
                    timestamp: new Date().toISOString(),
                    studentId: data.student_id,
                    duration: Date.now() - startTime,
                });
            }

        } catch (error) {
            setLoadingState(LOADING_STATES.ERROR);

            const predictionError = error instanceof PredictionError
                ? error
                : new PredictionError(
                    error instanceof Error ? error.message : 'Unknown error',
                    PredictionErrorType.UNKNOWN_ERROR
                );

            const errorMessage = predictionError.getUserMessage();
            state.setError(errorMessage);

            // Emit error event
            if (enableEvents) {
                await eventBus.emit<PredictionErrorEvent>(PREDICTION_EVENTS.ERROR, {
                    type: 'learning-style',
                    timestamp: new Date().toISOString(),
                    studentId: data.student_id,
                    error: predictionError,
                    duration: Date.now() - startTime,
                });
            }

            throw predictionError;
        } finally {
            state.setLoading(false);
        }
    }, [service, state, enablePersistence, enableEvents]);

    const handleReset = useCallback(async () => {
        state.resetForm();
        state.clearResults();
        state.setActiveTab('form');
        setLoadingState(LOADING_STATES.IDLE);

        // Emit reset event
        if (enableEvents) {
            await eventBus.emit(PREDICTION_EVENTS.RESET, {
                type: 'learning-style',
                timestamp: new Date().toISOString(),
            });
        }
    }, [state, enableEvents]);

    const loadHistory = useCallback(async (studentId: string): Promise<StoredLearningStyleResult[]> => {
        if (!enablePersistence) return [];
        return learningStyleRepository.getHistory(studentId);
    }, [enablePersistence]);

    return {
        handleSubmit,
        handleReset,
        loadingState,
        loadHistory,
    };
}
