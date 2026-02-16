/**
 * Predictor Error Boundary Component
 * Graceful error handling for predictor components
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class PredictorErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error for monitoring
        console.error('Predictor Error:', error, errorInfo);

        // Call optional error callback
        this.props.onError?.(error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const { fallback: FallbackComponent } = this.props;

            if (FallbackComponent && this.state.error) {
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}

interface FallbackProps {
    error: Error | null;
    resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: FallbackProps) {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Something Went Wrong
                    </CardTitle>
                    <CardDescription>
                        We encountered an error while processing your request.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-mono text-muted-foreground">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button onClick={resetError} variant="default">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Reload Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
