import { useMutation } from '@tanstack/react-query';
import { xaiService, type StudentRiskRequest } from '../services/xaiService';

/**
 * Custom hook for batch predicting student academic risk
 * Handles multiple student predictions at once
 */
export function useBatchPrediction() {
    const mutation = useMutation({
        mutationFn: (students: StudentRiskRequest[]) => xaiService.batchPredict(students),
        retry: 1,
        retryDelay: 2000,
    });

    return {
        batchPredict: mutation.mutate,
        batchPredictAsync: mutation.mutateAsync,
        predictions: mutation.data,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        reset: mutation.reset,
    };
}
