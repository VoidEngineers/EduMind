import { Button } from '@/components/ui/button';
import { Loader2, Save, Search, X } from 'lucide-react';
import type { FormActionsProps } from './types';

export function FormActions({ isLoading, isHealthy, onClearDraft }: FormActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {isHealthy ? (
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Analyze Risk Factors
                        </>
                    )}
                </Button>
            ) : (
                <Button
                    type="submit"
                    disabled={true} // Disabled when not healthy
                    className="w-full sm:w-auto min-w-[160px]"
                >
                    System Unavailable
                </Button>
            )}
            <div className="flex items-center justify-between gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClearDraft}
                    aria-label="Clear saved draft"
                    className="flex items-center gap-2 text-foreground bg-background border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                    <X size={16} />
                    Clear Draft
                </Button>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Save size={14} />
                    Auto-saving...
                </span>
            </div>
        </div>
    );
}