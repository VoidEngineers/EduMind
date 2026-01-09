import { AlertCircle, CheckCircle, GraduationCap, Moon, Sun } from 'lucide-react';
import type { LayoutProps,ErrorDisplayProps } from './types';

/**
 * Main layout wrapper with header, theme toggle, and toast
 */
export function XAILayout({ theme, ariaAnnouncement, toast, onToggleTheme, children }: LayoutProps) {
    return (
        <div className={`xai-prediction-container ${theme}`}>
            {/* ARIA live region */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {ariaAnnouncement}
            </div>

            {/* Theme Toggle */}
            <button
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Toast */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`} role="alert" aria-live="assertive">
                    <CheckCircle size={18} />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="xai-header">
                <h1>
                    <GraduationCap className="header-icon" size={40} />
                    Academic Risk Prediction
                </h1>
                <p>AI-powered early warning system for student success</p>
            </div>

            {/* Content */}
            <div className="xai-content">
                {children}
            </div>
        </div>
    );
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
    if (!error) return null;

    return (
        <div className="error-message" role="alert">
            <AlertCircle size={20} />
            {error instanceof Error ? error.message : 'An error occurred'}
        </div>
    );
}
