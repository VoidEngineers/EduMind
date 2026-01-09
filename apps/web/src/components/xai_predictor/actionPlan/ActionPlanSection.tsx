/**
 * Action Plan Section Component
 * Main container for the personalized action plan with timeline
 */

import { ActionItem } from './ActionItem';
import { ActionPlanControls } from './ActionPlanControls';
import { ActionPlanHeader } from './ActionPlanHeader';
import { calculateProgress, filterActions, getRiskSubtitle } from './actionPlanUtils';
import type { ActionPlanSectionProps } from './types';

export function ActionPlanSection({
    prediction,
    actionPlan,
    searchTerm,
    filterCategory,
    filterPriority,
    onSearchChange,
    onFilterCategoryChange,
    onFilterPriorityChange,
    onToggleComplete,
    onRemoveAction,
    onShowCustomize,
    setAriaAnnouncement
}: ActionPlanSectionProps) {
    // Calculate derived values
    const filteredActions = filterActions(actionPlan, searchTerm, filterCategory, filterPriority);
    const progress = calculateProgress(actionPlan);
    const completedCount = actionPlan.filter(a => a.isCompleted).length;
    const subtitle = getRiskSubtitle(prediction.risk_level);

    return (
        <div className="recommendations">
            <ActionPlanHeader
                subtitle={subtitle}
                progress={progress}
                completedCount={completedCount}
                totalCount={actionPlan.length}
                onShowCustomize={onShowCustomize}
            />

            <ActionPlanControls
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterPriority={filterPriority}
                onSearchChange={onSearchChange}
                onFilterCategoryChange={onFilterCategoryChange}
                onFilterPriorityChange={onFilterPriorityChange}
            />

            {/* Action Plan Timeline */}
            <div className="action-plan-timeline" role="list">
                {filteredActions.map((action, index) => (
                    <ActionItem
                        key={action.id}
                        action={action}
                        index={index}
                        isLast={index === filteredActions.length - 1}
                        onToggleComplete={onToggleComplete}
                        onRemoveAction={onRemoveAction}
                        setAriaAnnouncement={setAriaAnnouncement}
                    />
                ))}
            </div>
        </div>
    );
}
