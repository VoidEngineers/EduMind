/**
 * Loading State Types
 * State machine pattern for better loading UX
 */

export type LoadingStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

export interface LoadingState {
    status: LoadingStatus;
    progress?: number; // 0-100 for progress indication
    message?: string; // User-friendly message
}

export const LOADING_STATES = {
    IDLE: { status: 'idle' as const },
    VALIDATING: { status: 'validating' as const, message: 'Validating input...' },
    SUBMITTING: { status: 'submitting' as const, message: 'Analyzing data...' },
    SUCCESS: { status: 'success' as const, message: 'Analysis complete!' },
    ERROR: { status: 'error' as const },
} as const;

export function isLoading(state: LoadingState): boolean {
    return state.status === 'validating' || state.status === 'submitting';
}

export function isIdle(state: LoadingState): boolean {
    return state.status === 'idle';
}

export function isSuccess(state: LoadingState): boolean {
    return state.status === 'success';
}

export function isError(state: LoadingState): boolean {
    return state.status === 'error';
}
