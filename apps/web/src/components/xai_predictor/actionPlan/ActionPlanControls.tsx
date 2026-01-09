/**
 * Action Plan Controls Component
 * Search and filter controls for action plan
 */

import { Filter, Search } from 'lucide-react';
import type { ActionPlanControlsProps } from './types';

export function ActionPlanControls({
    searchTerm,
    filterCategory,
    filterPriority,
    onSearchChange,
    onFilterCategoryChange,
    onFilterPriorityChange
}: ActionPlanControlsProps) {
    return (
        <div className="action-controls">
            <div className="search-box">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search action items"
                />
            </div>
            <div className="filter-group">
                <Filter size={18} />
                <select
                    value={filterCategory}
                    onChange={(e) => onFilterCategoryChange(e.target.value)}
                    aria-label="Filter by category"
                >
                    <option value="all">All Categories</option>
                    <option value="academic">Academic</option>
                    <option value="engagement">Engagement</option>
                    <option value="time-management">Time Management</option>
                    <option value="support">Support</option>
                </select>
                <select
                    value={filterPriority}
                    onChange={(e) => onFilterPriorityChange(e.target.value)}
                    aria-label="Filter by priority"
                >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="standard">Standard</option>
                </select>
            </div>
        </div>
    );
}
