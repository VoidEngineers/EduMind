import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import './ModelDownFallback.css';
import type { ModelDownFallbackProps } from './types';

/**
 * Fallback UI when XAI model is unavailable
 * Displays maintenance message with retry option
 */
export function ModelDownFallback({ onRetry, modelStatus }: ModelDownFallbackProps) {
    return (
        <div className="model-down-fallback" role="alert" aria-live="polite">
            <div className="fallback-content">
                <div className="fallback-icon">
                    <Activity size={64} className="pulse-icon" />
                </div>

                <h2>Prediction Model Unavailable</h2>

                <p className="fallback-message">
                    The AI prediction model is currently unavailable. This could be due to:
                </p>

                <ul className="fallback-reasons">
                    <li>Scheduled maintenance</li>
                    <li>Model updates in progress</li>
                    <li>Temporary service disruption</li>
                </ul>

                {modelStatus && (
                    <div className="status-badge" aria-label={`Model status: ${modelStatus}`}>
                        <AlertCircle size={16} />
                        Status: {modelStatus}
                    </div>
                )}

                <p className="fallback-suggestion">
                    Please try again in a few minutes. If the problem persists, contact support.
                </p>

                {onRetry && (
                    <button
                        className="retry-button"
                        onClick={onRetry}
                        aria-label="Retry connection to prediction model"
                    >
                        <RefreshCw size={20} />
                        Retry Connection
                    </button>
                )}
            </div>
        </div>
    );
}
