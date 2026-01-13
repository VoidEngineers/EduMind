import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import type { ModelDownFallbackProps } from './types';

/**
 * Fallback UI when XAI model is unavailable
 * Displays maintenance message with retry option
 */
export function ModelDownFallback({ onRetry, modelStatus }: ModelDownFallbackProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-8" role="alert" aria-live="polite">
            <Card className="max-w-2xl w-full shadow-lg">
                <CardContent className="pt-12 pb-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-blue-600/10 rounded-full">
                            <Activity size={64} className="text-blue-600 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Prediction Model Unavailable</h2>
                        <p className="text-muted-foreground">
                            The AI prediction model is currently unavailable. This could be due to:
                        </p>
                    </div>

                    <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Scheduled maintenance
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Model updates in progress
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Temporary service disruption
                        </li>
                    </ul>

                    {modelStatus && (
                        <Badge variant="secondary" className="flex items-center gap-2 w-fit mx-auto" aria-label={`Model status: ${modelStatus}`}>
                            <AlertCircle size={16} />
                            Status: {modelStatus}
                        </Badge>
                    )}

                    <p className="text-sm text-muted-foreground">
                        Please try again in a few minutes. If the problem persists, contact support.
                    </p>

                    {onRetry && (
                        <Button
                            variant="default"
                            onClick={onRetry}
                            aria-label="Retry connection to prediction model"
                            className="flex items-center gap-2"
                        >
                            <RefreshCw size={20} />
                            Retry Connection
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
