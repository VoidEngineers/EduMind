/**
 * Results Actions Hook
 * Encapsulates all action callbacks for the results state
 * Prevents inline arrow functions and improves performance
 */

import { useCallback } from 'react';

interface UseResultsActionsProps {
    removeAction: (id: string) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    reset: () => void;
    announceReset: () => void;
    openWhatIfModal: () => void;
}

interface ResultsActions {
    handleRemoveAction: (id: string) => void;
    handleExportImage: () => void;
    handleWhatIf: () => void;
    handleReset: () => void;
}

/**
 * Custom hook that provides memoized action handlers for results state
 * Combines multiple context actions into single, reusable callbacks
 */
export function useResultsActions({
    removeAction,
    showSuccess,
    showInfo,
    reset,
    announceReset,
    openWhatIfModal
}: UseResultsActionsProps): ResultsActions {

    const handleRemoveAction = useCallback((id: string) => {
        removeAction(id);
        showSuccess('Action removed');
    }, [removeAction, showSuccess]);

    const handleExportImage = useCallback(() => {
        showInfo('Screenshot coming soon!');
    }, [showInfo]);

    const handleWhatIf = useCallback(() => {
        openWhatIfModal();
    }, [openWhatIfModal]);

    const handleReset = useCallback(() => {
        reset();
        announceReset();
    }, [reset, announceReset]);

    return {
        handleRemoveAction,
        handleExportImage,
        handleWhatIf,
        handleReset
    };
}
