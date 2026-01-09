import type { CustomizeModalFormProps } from './types';

export function CustomizeModalForm({
    newActionItem,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onCategoryChange,
}: CustomizeModalFormProps) {
    return (
        <div className="modal-body">
            <div className="form-group">
                <label htmlFor="custom-action-title">Action Title</label>
                <input
                    id="custom-action-title"
                    type="text"
                    value={newActionItem.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Enter action title"
                />
            </div>
            <div className="form-group">
                <label htmlFor="custom-action-description">Description</label>
                <textarea
                    id="custom-action-description"
                    value={newActionItem.description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Describe the action"
                    rows={3}
                />
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="custom-action-priority">Priority</label>
                    <select
                        id="custom-action-priority"
                        value={newActionItem.priority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                    >
                        <option value="standard">Standard</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="custom-action-category">Category</label>
                    <select
                        id="custom-action-category"
                        value={newActionItem.category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <option value="academic">Academic</option>
                        <option value="engagement">Engagement</option>
                        <option value="time-management">Time Management</option>
                        <option value="support">Support</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
