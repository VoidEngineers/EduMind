/**
 * Progress Circle Component
 * Displays circular progress indicator for action plan completion
 */

import type { ProgressCircleProps } from './types';

export function ProgressCircle({ progress }: ProgressCircleProps) {
    return (
        <div className="progress-indicator">
            <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="circular-progress">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#444"
                        strokeWidth="3"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#667eea"
                        strokeWidth="3"
                        strokeDasharray={`${progress}, 100`}
                    />
                </svg>
                <span className="progress-text">{progress}%</span>
            </div>
        </div>
    );
}
