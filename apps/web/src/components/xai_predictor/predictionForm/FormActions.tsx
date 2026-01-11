import { Brain, Save, X } from 'lucide-react';
import type { FormActionsProps } from './types';



export function FormActions({ isLoading, isHealthy, onClearDraft }: FormActionsProps) {
    return (
        <div className="form-actions">
            <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !isHealthy}
                aria-busy={isLoading}
            >
                <Brain size={20} />
                {isLoading ? 'Analyzing Student Data...' : 'Predict Academic Risk'}
            </button>
            <div className="draft-actions">
                <button
                    type="button"
                    className="draft-btn"
                    onClick={onClearDraft}
                    aria-label="Clear saved draft"
                >
                    <X size={16} />
                    Clear Draft
                </button>
                <span className="auto-save-indicator">
                    <Save size={14} />
                    Auto-saving...
                </span>
            </div>
        </div>
    );
}