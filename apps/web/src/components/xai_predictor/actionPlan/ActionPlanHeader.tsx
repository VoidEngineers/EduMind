/**
 * Action Plan Header Component
 * Displays header with title, subtitle, progress, and customize button
 */

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
        <div className="section-header-modern">
            <div className="section-header-content">
                <Lightbulb className="section-icon-large" size={32} />
                <div>
                    <h3>Personalized Action Plan</h3>
                    <p className="section-subtitle">{subtitle}</p>
                </div>
            </div>
            <div className="plan-controls">
                <ProgressCircle progress={progress} />
                <span
                    className="plan-progress"
                    aria-label={`Action plan progress: ${completedCount} of ${totalCount} items completed`}
                >
                    {completedCount} / {totalCount} completed
                </span>
                <button
                    className="customize-btn"
                    onClick={onShowCustomize}
                    aria-label="Customize action plan"
                >
                    <Settings size={20} />
                    Customize Plan
                </button>
            </div>
        </div>
    );
}
