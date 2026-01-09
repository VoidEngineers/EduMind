import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'xai_form_draft';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

/**
 * Custom hook for managing form draft with auto-save
 * Persists form data to localStorage with debouncing
 */
export function useFormDraft<T>(initialData: T) {
    const [formData, setFormData] = useState<T>(initialData);
    const [isDraftSaved, setIsDraftSaved] = useState(false);

    // Load draft on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                setFormData(parsedData);
                setIsDraftSaved(true);
            } catch {
                // If parsing fails, use initial data
                setFormData(initialData);
            }
        }
    }, []);

    // Auto-save with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
                setIsDraftSaved(true);
            }
        }, AUTO_SAVE_DELAY);

        return () => clearTimeout(timer);
    }, [formData]);

    const saveDraft = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setIsDraftSaved(true);
    }, [formData]);

    const loadDraft = useCallback(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                setFormData(parsedData);
                setIsDraftSaved(true);
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }, []);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setFormData(initialData);
        setIsDraftSaved(false);
    }, [initialData]);

    const hasDraft = useCallback(() => {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }, []);

    return {
        formData,
        setFormData,
        saveDraft,
        loadDraft,
        clearDraft,
        hasDraft: hasDraft(),
        isDraftSaved,
    };
}
