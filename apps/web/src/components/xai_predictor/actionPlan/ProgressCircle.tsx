import type { ProgressCircleProps } from './types';

export function ProgressCircle({ progress = 0 }: ProgressCircleProps) {
    // Ensure progress is a valid number
    const safeProgress = isNaN(progress) ? 0 : Math.round(Math.max(0, Math.min(100, progress)));

    return (
        <div
            className="relative w-12 h-12"
            role="progressbar"
            aria-valuenow={safeProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            title={`Progress: ${safeProgress}%`}
        >
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 pointer-events-none">
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted/20"
                />
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${safeProgress}, 100`}
                    className="text-primary ease-in-out duration-500 transition-all"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-foreground">
                    {safeProgress}%
                </span>
            </div>
        </div>
    );
}
