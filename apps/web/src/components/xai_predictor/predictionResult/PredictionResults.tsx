import { ActionPlanSection } from '../actionPlan/ActionPlanSection';
import { ProbabilitiesSection } from './ProbabilitiesSection';
import { QuickActions } from './QuickActions';
import { RiskBadge } from './RiskBadge';
import { RiskGauge } from './RiskGauge';
import type { PredictionResultsProps } from './types';

export function PredictionResults({
    prediction,
    // formData,
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
}: PredictionResultsProps) {
    return (
        <div className="results-container">
            <QuickActions
                onExportPDF={onExportPDF}
                onShare={onShare}
                onPrint={onPrint}
                onExportImage={onExportImage}
                onWhatIf={onWhatIf}
                onReset={onReset}
                setAriaAnnouncement={setAriaAnnouncement}
            />

            <RiskBadge riskLevel={prediction.risk_level} />

            <RiskGauge
                riskScore={prediction.risk_score}
                riskLevel={prediction.risk_level}
                theme={theme}
            />

            <ProbabilitiesSection probabilities={prediction.probabilities} />

            <ActionPlanSection
                prediction={prediction}
                actionPlan={actionPlan}
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterPriority={filterPriority}
                onSearchChange={onSearchChange}
                onFilterCategoryChange={onFilterCategoryChange}
                onFilterPriorityChange={onFilterPriorityChange}
                onToggleComplete={onToggleComplete}
                onRemoveAction={onRemoveAction}
                onShowCustomize={onShowCustomize}
                getProgress={getProgress}
                setAriaAnnouncement={setAriaAnnouncement}
            />
        </div>
    );
}