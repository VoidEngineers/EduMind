/**
 * Action Item Component
 * Individual action card in the timeline
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import { getCategoryIcon, getPriorityColor } from './actionPlanUtils';
import type { ActionItemProps } from './types';

export function ActionItem({
    action,
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
        <Card
            className="transition-all hover:shadow-md border border-border group overflow-hidden"
            style={{ borderLeftWidth: '4px', borderLeftColor: priorityColor }}
            role="listitem"
        >
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
                {/* Icon Column */}
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: `${priorityColor}15`, color: priorityColor }}
                >
                    <Icon size={20} />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {action.category.replace('-', ' ')}
                            </span>
                            <Badge
                                variant="outline"
                                className="text-xs font-bold"
                                style={{
                                    color: priorityColor,
                                    borderColor: `${priorityColor}40`,
                                    background: `${priorityColor}10`
                                }}
                            >
                                {action.priority.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <h4 className={`text-lg font-bold mb-1 ${action.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {action.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {action.description}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={action.isCompleted ? "secondary" : "default"}
                            size="sm"
                            onClick={handleToggleComplete}
                            aria-pressed={action.isCompleted}
                            className={`gap-2 ${!action.isCompleted ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : ''}`}
                        >
                            {action.isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                            {action.isCompleted ? 'Completed' : 'Mark Complete'}
                        </Button>

                        {action.isCustom && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveAction(action.id)}
                                className="text-destructive hover:bg-destructive/10"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
