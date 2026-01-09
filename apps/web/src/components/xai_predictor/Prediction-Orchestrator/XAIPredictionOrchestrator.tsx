/**
 * XAI Prediction Orchestrator
 * Contains all business logic and state management for XAI Prediction
 * Separated from main component for better testability and maintainability
 */

import { useXAI } from '../contexts/XAIContext';
import { useFormHandlers } from '../hooks/useFormHandlers';
import { useResultsActions } from '../hooks/useResultsActions';
import { ModelDownFallback } from '../modalDownFallback/ModelDownFallback';
import { FormState, LoadingState, ResultsState } from '../prediction-state';
import type { StudentRiskRequest } from '../services/xaiService';
import { ErrorDisplay, XAILayout } from '../xai-Layout/XAILayout';
import { XAIModals } from '../xai-modals/XAIModals';

/**
 * Orchestrator component that manages all XAI Prediction logic
 * This component handles:
 * - State access from context
 * - Hook composition
 * - Conditional rendering logic
 * - Layout and structure
 */
export function XAIPredictionOrchestrator() {
    // Access all context state
    const { prediction, modelHealth, toast, form, actionPlan, ui, modal, filter, aria } = useXAI();

    // Form handlers hook
    const { handleInputChange, handleSubmit } = useFormHandlers({
        setFormData: form.setFormData,
        predict: () => prediction.predict(form.formData),
        announceLoading: aria.announceLoading,
        announceError: aria.announceError
    });

    // Results actions hook
    const resultsActions = useResultsActions({
        removeAction: actionPlan.removeAction,
        showSuccess: toast.showSuccess,
        showInfo: toast.showInfo,
        reset: prediction.reset,
        announceReset: aria.announceReset,
        openWhatIfModal: ui.openWhatIfModal
    });

    // Model down fallback - early return
    if (!modelHealth.isHealthy && !modelHealth.isModelLoaded) {
        return (
            <ModelDownFallback
                onRetry={modelHealth.refetch}
                modelStatus={modelHealth.health?.status || 'unknown'}
            />
        );
    }

    // Main render
    return (
        <XAILayout
            theme={ui.theme}
            ariaAnnouncement={aria.ariaAnnouncement}
            toast={toast.toast}
            onToggleTheme={ui.toggleTheme}
        >
            <ErrorDisplay error={prediction.isError ? prediction.error : null} />

            {/* Loading State */}
            {prediction.isLoading && <LoadingState />}

            {/* Form State */}
            {!prediction.isLoading && !prediction.prediction && (
                <FormState
                    formData={form.formData}
                    onInputChange={handleInputChange}
                    onSelectChange={(field, value) => form.setFormData((prev: StudentRiskRequest) => ({ ...prev, [field]: value }))}
                    onSubmit={handleSubmit}
                    onClearDraft={form.clearDraft}
                    isLoading={prediction.isLoading}
                    isHealthy={modelHealth.isHealthy}
                />
            )}

            {/* Results State */}
            {prediction.prediction && !prediction.isLoading && (
                <ResultsState
                    prediction={prediction.prediction}
                    formData={form.formData}
                    actionPlan={actionPlan.actionPlan}
                    theme={ui.theme}
                    searchTerm={filter.searchTerm}
                    filterCategory={filter.filterCategory}
                    filterPriority={filter.filterPriority}
                    onSearchChange={filter.setSearchTerm}
                    onFilterCategoryChange={filter.setFilterCategory}
                    onFilterPriorityChange={filter.setFilterPriority}
                    onToggleComplete={actionPlan.toggleComplete}
                    onRemoveAction={resultsActions.handleRemoveAction}
                    onShowCustomize={modal.openModal}
                    onExportPDF={ui.handleExportPDF}
                    onShare={ui.handleShare}
                    onPrint={ui.handleExportPDF}
                    onExportImage={resultsActions.handleExportImage}
                    onWhatIf={resultsActions.handleWhatIf}
                    onReset={resultsActions.handleReset}
                    getProgress={actionPlan.getProgress}
                    setAriaAnnouncement={aria.setAriaAnnouncement}
                />
            )}

            {/* Modals */}
            <XAIModals />
        </XAILayout>
    );
}
