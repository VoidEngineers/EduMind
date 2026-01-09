import { useQuery } from '@tanstack/react-query';
import { xaiService } from '../services/xaiService';

/**
 * Custom hook for checking XAI model health
 * Polls the health endpoint every 30 seconds
 */
export function useModelHealth() {
    const query = useQuery({
        queryKey: ['model-health'],
        queryFn: () => xaiService.checkHealth(),
        // Refetch every 30 seconds
        refetchInterval: 30000,
        // Keep previous data while refetching
        placeholderData: (previousData) => previousData,
        // Retry 3 times before marking as error
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    const isHealthy = query.data?.status === 'healthy' && query.data?.model_loaded === true;
    const isModelLoaded = query.data?.model_loaded ?? false;

    return {
        health: query.data,
        isHealthy,
        isModelLoaded,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
