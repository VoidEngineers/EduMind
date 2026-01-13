/**
 * Action Plan Controls Component
 * Search and filter controls for action plan
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import type { ActionPlanControlsProps } from './types';

export function ActionPlanControls(props: ActionPlanControlsProps) {
    const {
        searchTerm,
        filterCategory,
        filterPriority,
        onSearchChange,
        onFilterCategoryChange,
        onFilterPriorityChange
    } = props;
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search action items"
                    className="pl-10 bg-background border focus:border-primary text-foreground"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-foreground" />
                    <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                        <SelectTrigger className="w-[180px] bg-background border focus:border-primary text-foreground" aria-label="Filter by category">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="time-management">Time Management</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
                    <SelectTrigger className="w-[180px] bg-background border focus:border-primary text-foreground" aria-label="Filter by priority">
                        <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                </Select>
                <div className="w-px h-10 bg-border mx-2 hidden md:block" />
                <Select value={props.groupBy} onValueChange={props.onGroupByChange}>
                    <SelectTrigger className="w-[180px] bg-background border focus:border-primary text-foreground" aria-label="Group actions by">
                        <SelectValue placeholder="Group By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="priority">Group by Priority</SelectItem>
                        <SelectItem value="category">Group by Category</SelectItem>
                        <SelectItem value="none">No Grouping</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
