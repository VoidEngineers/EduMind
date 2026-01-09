import { useCallback, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
    show: boolean;
    message: string;
    type: ToastType;
}

const AUTO_DISMISS_DELAY = 3000; // 3 seconds

/**
 * Custom hook for managing toast notifications
 * Auto-dismisses after 3 seconds
 */
export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'info',
    });

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ show: true, message, type });

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, AUTO_DISMISS_DELAY);
    }, []);

    const showSuccess = useCallback((message: string) => {
        showToast(message, 'success');
    }, [showToast]);

    const showError = useCallback((message: string) => {
        showToast(message, 'error');
    }, [showToast]);

    const showInfo = useCallback((message: string) => {
        showToast(message, 'info');
    }, [showToast]);

    const showWarning = useCallback((message: string) => {
        showToast(message, 'warning');
    }, [showToast]);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, []);

    return {
        toast,
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        hideToast,
    };
}
