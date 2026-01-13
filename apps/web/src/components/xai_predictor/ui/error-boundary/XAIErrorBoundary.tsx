import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { ErrorInfo } from 'react';
import { Component } from 'react';
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
                <div className="min-h-screen bg-background flex items-center justify-center p-8" role="alert" aria-live="assertive">
                    <Card className="max-w-2xl w-full shadow-xl border-destructive/50">
                        <CardContent className="pt-12 pb-8 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="p-4 bg-destructive/10 rounded-full">
                                    <AlertTriangle size={64} className="text-destructive" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">Something went wrong</h1>
                                <p className="text-muted-foreground text-lg">
                                    The prediction system encountered an unexpected error.
                                    This has been logged and we'll look into it.
                                </p>
                            </div>

                            {this.state.error && (
                                <details className="text-left bg-muted/50 rounded-lg p-4">
                                    <summary className="cursor-pointer font-semibold mb-2">Technical Details</summary>
                                    <pre className="text-sm overflow-auto bg-background p-4 rounded border mt-2">
                                        <code className="text-destructive">{this.state.error.toString()}</code>
                                        {this.state.errorInfo && (
                                            <code className="block mt-2 text-muted-foreground">{this.state.errorInfo.componentStack}</code>
                                        )}
                                    </pre>
                                </details>
                            )}

                            <div className="flex gap-4 justify-center pt-4">
                                <Button
                                    variant="default"
                                    onClick={this.handleReset}
                                    aria-label="Try again"
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw size={20} />
                                    Try Again
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={this.handleGoHome}
                                    aria-label="Go to homepage"
                                    className="flex items-center gap-2"
                                >
                                    <Home size={20} />
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
