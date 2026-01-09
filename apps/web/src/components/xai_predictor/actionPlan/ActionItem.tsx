/**
 * Action Item Component
 * Individual action card in the timeline
 */

import { AlertCircle, CheckCircle, Circle, X } from 'lucide-react';
import { getCategoryIcon, getPriorityColor} from './actionPlanUtils';
import type { ActionItemProps } from './types';

export function ActionItem({
    action,
    index,
    isLast,
    onToggleComplete,
    onRemoveAction,
    setAriaAnnouncement
}: ActionItemProps) {
    const Icon = getCategoryIcon(action.category);
    const priorityColor = getPriorityColor(action.priority);

    const handleToggleComplete = () => {
        onToggleComplete(action.id);
        setAriaAnnouncement(
            action.isCompleted
                ? `Marked ${action.title} as incomplete`
                : `Marked ${action.title} as complete`
        );
    };

    return (
        <div className="action-item-wrapper" role="listitem">
            <div className="action-item-timeline">
                <div
                    className="timeline-dot"
                    style={{ background: priorityColor }}
                    aria-hidden="true"
                >
                    <span className="step-number">{index + 1}</span>
                </div>
                {!isLast && <div className="timeline-line"></div>}
            </div>

            <div className="action-item-card">
                <div className="action-card-header">
                    <div className="action-category">
                        <div
                            className="category-icon"
                            style={{ background: `${priorityColor}20`, color: priorityColor }}
                            aria-hidden="true"
                        >
                            <Icon size={20} />
                        </div>
                        <span className="category-label">{action.category.replace('-', ' ')}</span>
                    </div>
                    <div
                        className="priority-badge"
                        style={{
                            background: `${priorityColor}15`,
                            borderColor: `${priorityColor}50`,
                            color: priorityColor
                        }}
                    >
                        {action.priority === 'critical' && <AlertCircle size={14} />}
                        {action.priority.toUpperCase()}
                    </div>
                </div>

                <div className="action-card-body">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                </div>

                <div className="action-card-footer">
                    <button
                        className={`action-btn-complete ${action.isCompleted ? 'completed' : ''}`}
                        onClick={handleToggleComplete}
                        aria-pressed={action.isCompleted}
                        aria-label={action.isCompleted ? `Mark ${action.title} as incomplete` : `Mark ${action.title} as complete`}
                    >
                        {action.isCompleted ? (
                            <>
                                <CheckCircle size={16} />
                                Completed
                            </>
                        ) : (
                            <>
                                <Circle size={16} />
                                Mark Complete
                            </>
                        )}
                    </button>

                    {action.isCustom && (
                        <button
                            className="action-btn-delete"
                            onClick={() => onRemoveAction(action.id)}
                            aria-label={`Remove ${action.title} from action plan`}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
