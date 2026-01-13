/**
 * Action Plan Header Component
 * Displays header with title, subtitle, progress, and customize button
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Settings } from 'lucide-react';
import { ProgressCircle } from './ProgressCircle';
import type { ActionPlanHeaderProps } from './types';

export function ActionPlanHeader({
    subtitle,
    progress,
    completedCount,
    totalCount,
    onShowCustomize
}: ActionPlanHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 mb-8">
            <div className="flex items-center gap-4">
                <Lightbulb size={40} className="text-cyan-600 drop-shadow-md flex-shrink-0" />
                <div>
                    <h3 className="text-2xl font-bold text-foreground">Personalized Action Plan</h3>
                    <p className="text-muted-foreground mt-1">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <ProgressCircle progress={progress} />
                    <Badge
                        variant="secondary"
                        className="px-4 py-2 text-sm font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-700"
                        aria-label={`Action plan progress: ${completedCount} of ${totalCount} items completed`}
                    >
                        {completedCount} / {totalCount} completed
                    </Badge>
                </div>
                <Button
                    onClick={onShowCustomize}
                    aria-label="Customize action plan"
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white border border-blue-500 shadow-sm"
                >
                    <Settings size={20} />
                    Customize Plan
                </Button>
            </div>
        </div>
    );
}
