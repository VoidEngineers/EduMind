import { useMutation, useQueryClient } from '@tanstack/react-query';
import { xaiService, type StudentRiskRequest } from '../services/xaiService';

/**
 * Custom hook for predicting student academic risk
 * Uses React Query's useMutation for state management
 */
export function useStudentRiskPrediction() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (studentData: StudentRiskRequest) => xaiService.predictRisk(studentData),
        onSuccess: (data, variables) => {
            // Cache the prediction by student_id
            queryClient.setQueryData(['risk-prediction', variables.student_id], data);
        },
        // Retry once on failure
        retry: 1,
        retryDelay: 1000,
    });

    return {
        predict: mutation.mutate,
        predictAsync: mutation.mutateAsync,
        prediction: mutation.data,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        reset: mutation.reset,
    };
}
