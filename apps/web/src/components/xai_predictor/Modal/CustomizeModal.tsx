import { X } from 'lucide-react';
import { CustomizeModalForm } from './CustomizeModalForm';
import type { CustomizeModalProps } from './types';

export function CustomizeModal({
    show,
    newActionItem,
    onClose,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onCategoryChange,
    onAdd
}: CustomizeModalProps) {
    if (!show) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-modal-title"
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="customize-modal-title">Add Custom Action</h3>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close customize modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <CustomizeModalForm
                    newActionItem={newActionItem}
                    onTitleChange={onTitleChange}
                    onDescriptionChange={onDescriptionChange}
                    onPriorityChange={onPriorityChange}
                    onCategoryChange={onCategoryChange}
                />
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={onAdd}>
                        Add Action
                    </button>
                </div>
            </div>
        </div>
    );
}
