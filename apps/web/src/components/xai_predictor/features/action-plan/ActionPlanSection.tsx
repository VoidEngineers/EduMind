/**
 * Action Plan Section Component
 * Main container for the personalized action plan with timeline
 */

import { useMemo, useState } from 'react';
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
    // Calculate derived values with useMemo for reactive updates
    const filteredActions = filterActions(actionPlan, searchTerm, filterCategory, filterPriority);
    const progress = calculateProgress(filteredActions); // Use filtered actions for progress
    const completedCount = useMemo(() =>
        filteredActions.filter(a => a.isCompleted).length, // Count only visible/filtered actions
        [filteredActions]
    );
    const subtitle = getRiskSubtitle(prediction.risk_level);

    const [groupBy, setGroupBy] = useState<string>('priority');

    // Grouping Logic
    const getGroupedActions = () => {
        if (groupBy === 'none') return { 'All Actions': filteredActions };

        const groups: Record<string, typeof filteredActions> = {};

        filteredActions.forEach(action => {
            const key = groupBy === 'priority' ? action.priority : action.category;
            if (!groups[key]) groups[key] = [];
            groups[key].push(action);
        });

        // Sort keys (custom order for priority)
        if (groupBy === 'priority') {
            const priorityOrder = ['critical', 'high', 'medium', 'standard'];
            return Object.fromEntries(
                Object.entries(groups).sort((a, b) => priorityOrder.indexOf(a[0]) - priorityOrder.indexOf(b[0]))
            );
        }

        return groups;
    };

    const groupedActions = getGroupedActions();

    return (
        <div className="py-12 border-t border-border">
            <ActionPlanHeader
                subtitle={subtitle}
                progress={progress}
                completedCount={completedCount}
                totalCount={filteredActions.length}
                onShowCustomize={onShowCustomize}
            />

            <ActionPlanControls
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterPriority={filterPriority}
                groupBy={groupBy}
                onSearchChange={onSearchChange}
                onFilterCategoryChange={onFilterCategoryChange}
                onFilterPriorityChange={onFilterPriorityChange}
                onGroupByChange={setGroupBy}
            />

            {/* Action Plan List (Grouped) */}
            <div className="flex flex-col space-y-8 mt-8">
                {Object.entries(groupedActions).map(([groupKey, actions]) => (
                    actions.length > 0 && (
                        <div key={groupKey} className="space-y-4">
                            {groupBy !== 'none' && (
                                <h3 className="text-lg font-semibold capitalize flex items-center gap-2 text-foreground/80 border-b pb-2">
                                    {groupKey.replace('-', ' ')}
                                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                        {actions.length}
                                    </span>
                                </h3>
                            )}
                            <div className="flex flex-col space-y-4" role="list">
                                {actions.map((action, index) => (
                                    <ActionItem
                                        key={action.id}
                                        action={action}
                                        index={index}
                                        isLast={false}
                                        onToggleComplete={onToggleComplete}
                                        onRemoveAction={onRemoveAction}
                                        setAriaAnnouncement={setAriaAnnouncement}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                ))}
                {uniqueId(filteredActions) && filteredActions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No actions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
// Helper to avoid duplicate key issues if filteredActions is empty
const uniqueId = (arr: any[]) => arr.length;
