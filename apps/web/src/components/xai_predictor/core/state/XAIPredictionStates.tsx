/**
 * XAI Prediction State Components
 * Encapsulates conditional rendering logic for different prediction states
 */

import { PredictionForm } from '../../features/prediction-form/PredictionForm';
import { PredictionResults } from '../../features/prediction-results/PredictionResults';
import { PredictionResultsSkeleton } from '../../ui/skeletons/PredictionResultsSkeleton';
import type { XaiFormStateProps, XaiResultsStateProps } from './types';

// ============================================================================
// Loading State
// ============================================================================

export function LoadingState() {
    return (
        <div role="status" aria-label="Loading prediction results">
            <PredictionResultsSkeleton />
        </div>
    );
}

// ============================================================================
// Form State
// ============================================================================

export function FormState({
    formData,
    onInputChange,
    onSelectChange,
    onSubmit,
    onClearDraft,
    isLoading,
    isHealthy
}: XaiFormStateProps) {
    return (
        <PredictionForm
            formData={formData}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            onClearDraft={onClearDraft}
            isLoading={isLoading}
            isHealthy={isHealthy}
        />
    );
}

// ============================================================================
// Results State
// ============================================================================
export function ResultsState({
    prediction,
    formData,
    actionPlan,
    theme,
    searchTerm,
    filterCategory,
    filterPriority,
    onSearchChange,
    onFilterCategoryChange,
    onFilterPriorityChange,
    onToggleComplete,
    onRemoveAction,
    onShowCustomize,
    onExportPDF,
    onShare,
    onPrint,
    onExportImage,
    onWhatIf,
    onReset,
    getProgress,
    setAriaAnnouncement
}: XaiResultsStateProps) {
    return (
        <PredictionResults
            prediction={prediction}
            formData={formData}
            actionPlan={actionPlan}
            theme={theme}
            searchTerm={searchTerm}
            filterCategory={filterCategory}
            filterPriority={filterPriority}
            onSearchChange={onSearchChange}
            onFilterCategoryChange={onFilterCategoryChange}
            onFilterPriorityChange={onFilterPriorityChange}
            onToggleComplete={onToggleComplete}
            onRemoveAction={onRemoveAction}
            onShowCustomize={onShowCustomize}
            onExportPDF={onExportPDF}
            onShare={onShare}
            onPrint={onPrint}
            onExportImage={onExportImage}
            onWhatIf={onWhatIf}
            onReset={onReset}
            getProgress={getProgress}
            setAriaAnnouncement={setAriaAnnouncement}
        />
    );
}
