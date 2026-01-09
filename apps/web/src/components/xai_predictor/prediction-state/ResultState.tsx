import { PredictionResults } from '../predictionResult/PredictionResults';
import type { ResultsStateProps } from './types';

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
}: ResultsStateProps) {
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