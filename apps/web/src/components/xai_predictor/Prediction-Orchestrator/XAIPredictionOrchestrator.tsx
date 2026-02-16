/**
 * XAI Prediction Orchestrator
 * Refactored to use pure Zustand + Custom Hook (No Context)
 * UI Components imported directly (no wrappers)
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useResultsActions } from '../core/hooks/useResultsActions';
import { useXAILogic } from '../core/hooks/useXAILogic';
import { StudentRiskRequestSchema, type StudentRiskRequest } from '../core/schemas/xai.schemas';
import { PredictionForm } from '../features/prediction-form/PredictionForm';
import { PredictionResults } from '../features/prediction-results/PredictionResults';
import { ModelDownFallback } from '../ui/fallbacks/ModelDownFallback';
import { ErrorDisplay, XAILayout } from '../ui/layout/XAILayout';
import { XAIModals } from '../ui/modals-container/XAIModals';
import { PredictionResultsSkeleton } from '../ui/skeletons/PredictionResultsSkeleton';

export function XAIPredictionOrchestrator() {
    // Access logic from custom hook (replaces Context)
    const { prediction, modelHealth, toast, form: storeForm, actionPlan, ui, modal, filter, aria } = useXAILogic();

    // RHF Init
    const form = useForm<StudentRiskRequest>({
        resolver: zodResolver(StudentRiskRequestSchema),
        defaultValues: storeForm.formData, // Init with store values
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data: StudentRiskRequest) => {
        aria.announceLoading();
        try {
            storeForm.setFormData(data); // Sync to store
            await prediction.predict(data);
        } catch {
            aria.announceError();
        }
    };

    // Results actions hook
    const resultsActions = useResultsActions({
        removeAction: actionPlan.removeAction,
        showSuccess: toast.showSuccess,
        showInfo: toast.showInfo,
        reset: () => {
            prediction.reset();
            reset(storeForm.formData); // Reset RHF to store defaults
        },
        announceReset: aria.announceReset,
        openWhatIfModal: ui.openWhatIfModal
    });

    // Handle Clear Draft logic (which was passed to FormState)
    const handleClearDraft = () => {
        storeForm.clearDraft();
        reset(storeForm.formData); // RHF reset
    };

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
            {prediction.isLoading && (
                <div role="status" aria-label="Loading prediction results">
                    <PredictionResultsSkeleton />
                </div>
            )}

            {/* Form State */}
            {!prediction.isLoading && !prediction.prediction && (
                <PredictionForm
                    form={form}
                    onSubmit={handleSubmit(onSubmit)}
                    onClearDraft={handleClearDraft}
                    isLoading={prediction.isLoading}
                    isHealthy={modelHealth.isHealthy}
                />
            )}

            {/* Results State */}
            {prediction.prediction && !prediction.isLoading && (
                <PredictionResults
                    prediction={prediction.prediction}
                    formData={storeForm.formData}
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
