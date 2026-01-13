import { useState } from 'react';

/**
 * Hook to manage custom action modal state
 */
export function useCustomActionModal(
    addAction: (action: any) => void,
    showSuccess: (msg: string) => void
) {
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [newActionItem, setNewActionItem] = useState({
        title: '',
        description: '',
        priority: 'standard' as const,
        category: 'academic' as const
    });

    const openModal = () => setShowCustomizeModal(true);
    const closeModal = () => setShowCustomizeModal(false);

    const updateTitle = (title: string) => {
        setNewActionItem(prev => ({ ...prev, title }));
    };

    const updateDescription = (description: string) => {
        setNewActionItem(prev => ({ ...prev, description }));
    };

    const updatePriority = (priority: string) => {
        setNewActionItem(prev => ({ ...prev, priority: priority as any }));
    };

    const updateCategory = (category: string) => {
        setNewActionItem(prev => ({ ...prev, category: category as any }));
    };

    const addCustomAction = () => {
        if (newActionItem.title.trim()) {
            addAction({
                title: newActionItem.title,
                description: newActionItem.description,
                priority: newActionItem.priority,
                category: newActionItem.category,
            });
            setNewActionItem({
                title: '',
                description: '',
                priority: 'standard',
                category: 'academic'
            });
            closeModal();
            showSuccess('Custom action added to your plan');
        }
    };

    return {
        showCustomizeModal,
        newActionItem,
        openModal,
        closeModal,
        updateTitle,
        updateDescription,
        updatePriority,
        updateCategory,
        addCustomAction
    };
}
