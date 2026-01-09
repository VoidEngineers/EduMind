import { useEffect, useState } from 'react';
import type { RiskPredictionResponse } from '../services/xaiService';

/**
 * Hook to manage ARIA announcements for screen readers
 */
export function useAriaAnnouncements(
    prediction: RiskPredictionResponse | null,
    isError: boolean,
    error: Error | null,
    showSuccess: (msg: string) => void,
    showError: (msg: string) => void
) {
    const [ariaAnnouncement, setAriaAnnouncement] = useState('');

    // Announce prediction completion
    useEffect(() => {
        if (prediction) {
            const announcement = `Prediction complete. Risk level: ${prediction.risk_level}. Risk score: ${(prediction.risk_score * 100).toFixed(0)} percent.`;
            setAriaAnnouncement(announcement);
            showSuccess('Prediction complete!');
        }
    }, [prediction, showSuccess]);

    // Announce errors
    useEffect(() => {
        if (isError && error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setAriaAnnouncement(`Error: ${errorMessage}`);
            showError(errorMessage);
        }
    }, [isError, error, showError]);

    const announceLoading = () => {
        setAriaAnnouncement('Analyzing student data. Please wait.');
    };

    const announceError = () => {
        setAriaAnnouncement('Prediction failed. Please try again.');
    };

    const announceReset = () => {
        setAriaAnnouncement('Prediction cleared. Ready for new prediction.');
    };

    return {
        ariaAnnouncement,
        setAriaAnnouncement,
        announceLoading,
        announceError,
        announceReset
    };
}
