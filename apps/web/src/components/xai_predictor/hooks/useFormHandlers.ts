/**
 * Form Handlers Hook
 * Encapsulates form event handling logic for XAI prediction forms
 */

import { useCallback } from 'react';
import type { StudentRiskRequest } from '../services/xaiService';

interface UseFormHandlersProps {
    setFormData: React.Dispatch<React.SetStateAction<StudentRiskRequest>>;
    predict: (data: StudentRiskRequest) => void;
    announceLoading: () => void;
    announceError: () => void;
}

interface FormHandlers {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook that provides memoized form event handlers
 * Prevents unnecessary re-renders and keeps handler logic reusable
 */
export function useFormHandlers({
    setFormData,
    predict,
    announceLoading,
    announceError
}: UseFormHandlersProps): FormHandlers {

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    }, [setFormData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        announceLoading();
        try {
            predict(setFormData as any); // Will be called with current form data from context
        } catch {
            announceError();
        }
    }, [predict, announceLoading, announceError, setFormData]);

    return {
        handleInputChange,
        handleSubmit
    };
}
