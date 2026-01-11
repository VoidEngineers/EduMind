import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { ErrorInfo } from 'react';
import { Component } from 'react';
import './XAIErrorBoundary.css';
import type { Props, State } from './types';

/**
 * Error Boundary for XAI Prediction components
 * Catches runtime errors and displays user-friendly fallback UI
 */
export class XAIErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('XAI Error Boundary caught an error:', error, errorInfo);
        }

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Log to error reporting service (e.g., Sentry)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="xai-error-boundary" role="alert" aria-live="assertive">
                    <div className="error-content">
                        <div className="error-icon">
                            <AlertTriangle size={64} />
                        </div>

                        <h1>Something went wrong</h1>

                        <p className="error-message">
                            The prediction system encountered an unexpected error.
                            This has been logged and we'll look into it.
                        </p>

                        {this.state.error && (
                            <details className="error-details">
                                <summary>Technical Details</summary>
                                <pre className="error-stack">
                                    <code>{this.state.error.toString()}</code>
                                    {this.state.errorInfo && (
                                        <code>{this.state.errorInfo.componentStack}</code>
                                    )}
                                </pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="btn-primary"
                                onClick={this.handleReset}
                                aria-label="Try again"
                            >
                                <RefreshCw size={20} />
                                Try Again
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={this.handleGoHome}
                                aria-label="Go to homepage"
                            >
                                <Home size={20} />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
