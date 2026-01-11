import { PredictionForm } from '../predictionForm/PredictionForm';
import type { FormStateProps } from './types';

export function FormState({
    formData,
    onInputChange,
    onSelectChange,
    onSubmit,
    onClearDraft,
    isLoading,
    isHealthy
}: FormStateProps) {
    return (
        <PredictionForm
            formData={formData}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            onClearDraft={onClearDraft}
            isLoading={isLoading}
            isHealthy={isHealthy}
        />
    );
}