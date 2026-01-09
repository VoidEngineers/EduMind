import type { ModalActionsProps } from './types';

export function ModalActions({ onReset, onSimulate, isSimulating, hasChanges }: ModalActionsProps) {
    return (
        <div className="modal-actions">
            <button
                className="btn-secondary"
                onClick={onReset}
                disabled={isSimulating}
            >
                Reset to Current
            </button>
            <button
                className="btn-primary"
                onClick={onSimulate}
                disabled={isSimulating || !hasChanges}
                title={!hasChanges ? 'Adjust at least one metric to run simulation' : ''}
            >
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
        </div>
    );
}
