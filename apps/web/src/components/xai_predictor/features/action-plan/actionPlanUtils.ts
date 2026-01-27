/**
 * Action Plan Utilities
 * Helper functions for action plan rendering and filtering
 */

import {
    BookOpen,
    Calendar,
    Target,
    Users,
    type LucideIcon
} from 'lucide-react';

import type { ActionItem } from '@/store/xaiStore';

/**
 * Category configuration
 */
export const CATEGORY_CONFIG: Record<string, { icon: LucideIcon; label: string }> = {
    academic: { icon: BookOpen, label: 'Academic' },
    engagement: { icon: Users, label: 'Engagement' },
    'time-management': { icon: Calendar, label: 'Time Management' },
    support: { icon: Target, label: 'Support' }
};

/**
 * Priority configuration
 */
export const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
    critical: { color: '#ef4444', label: 'Critical' },
    high: { color: '#f59e0b', label: 'High' },
    medium: { color: '#3b82f6', label: 'Medium' },
    standard: { color: '#22c55e', label: 'Standard' }
};

/**
 * Get category icon component
 */
export const getCategoryIcon = (category: string): LucideIcon => {
    return CATEGORY_CONFIG[category]?.icon || BookOpen;
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: string): string => {
    return PRIORITY_CONFIG[priority]?.color || '#22c55e';
};

/**
 * Filter actions based on search and filter criteria
 */
export const filterActions = (
    actions: ActionItem[],
    searchTerm: string,
    filterCategory: string,
    filterPriority: string
): ActionItem[] => {
    return actions.filter(action => {
        const matchesSearch =
            action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            action.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
        const matchesPriority = filterPriority === 'all' || action.priority === filterPriority;
        return matchesSearch && matchesCategory && matchesPriority;
    });
};

/**
 * Calculate action plan completion progress
 */
export const calculateProgress = (actions: ActionItem[]): number => {
    if (actions.length === 0) return 0;
    const completed = actions.filter(a => a.isCompleted).length;
    return Math.round((completed / actions.length) * 100);
};

/**
 * Get risk-based subtitle message
 */
export const getRiskSubtitle = (riskLevel: string): string => {
    switch (riskLevel) {
        case 'Safe':
            return 'Maintain your excellent performance with these enhancement strategies';
        case 'Medium Risk':
            return 'Follow these steps to improve your academic standing';
        default:
            return 'URGENT: Immediate action required to prevent academic failure';
    }
};
