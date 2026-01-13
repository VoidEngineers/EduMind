import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import type { ModalActionsProps } from './types';

export function ModalActions({ onReset, onSimulate, isSimulating, hasChanges }: ModalActionsProps) {
    return (
        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button
                variant="outline"
                onClick={onReset}
                disabled={isSimulating}
                className="bg-background text-foreground border-input hover:bg-muted"
            >
                <RefreshCw size={16} className="mr-2" />
                Reset to Current
            </Button>
            <Button
                onClick={onSimulate}
                disabled={isSimulating || !hasChanges}
                title={!hasChanges ? 'Adjust at least one metric to run simulation' : ''}
            >
                {isSimulating ? (
                    <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Simulating...
                    </>
                ) : (
                    <>
                        <Play size={16} className="mr-2" />
                        Run Simulation
                    </>
                )}
            </Button>
        </div>
    );
}
