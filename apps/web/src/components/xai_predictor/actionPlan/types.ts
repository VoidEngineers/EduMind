import type { ActionItem } from '../prediction-state/types';
import type { RiskPredictionResponse } from '../services/xaiService';

export type ActionPlanSectionProps = {
    prediction: RiskPredictionResponse;
    actionPlan: ActionItem[];
    searchTerm: string;
    filterCategory: string;
    filterPriority: string;
    onSearchChange: (value: string) => void;
    onFilterCategoryChange: (value: string) => void;
    onFilterPriorityChange: (value: string) => void;
    onToggleComplete: (id: string) => void;
    onRemoveAction: (id: string) => void;
    onShowCustomize: () => void;
    getProgress: () => number;
    setAriaAnnouncement: (message: string) => void;
}

export type ProgressCircleProps = {
    progress: number;
}

export type ActionPlanHeaderProps = {
    subtitle: string;
    progress: number;
    completedCount: number;
    totalCount: number;
    onShowCustomize: () => void;
}

export type ActionPlanControlsProps = {
    searchTerm: string;
    filterCategory: string;
    filterPriority: string;
    onSearchChange: (value: string) => void;
    onFilterCategoryChange: (value: string) => void;
    onFilterPriorityChange: (value: string) => void;
}

export type ActionItemProps = {
    action: ActionItem;
    index: number;
    isLast: boolean;
    onToggleComplete: (id: string) => void;
    onRemoveAction: (id: string) => void;
    setAriaAnnouncement: (message: string) => void;
}
