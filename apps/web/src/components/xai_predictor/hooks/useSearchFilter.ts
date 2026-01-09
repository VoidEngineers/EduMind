import { useState } from 'react';

/**
 * Hook to manage search and filter state
 */
export function useSearchFilter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterPriority('all');
    };

    return {
        searchTerm,
        filterCategory,
        filterPriority,
        setSearchTerm,
        setFilterCategory,
        setFilterPriority,
        resetFilters
    };
}
