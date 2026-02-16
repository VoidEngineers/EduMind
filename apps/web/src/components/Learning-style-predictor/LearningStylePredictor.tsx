/**
 * Learning Style Predictor Component
 * Main entry point - orchestrates form and results
 * Enhanced with error boundary and service factory
 */

import { PredictorErrorBoundary } from '@/components/common/PredictorErrorBoundary';
import { useLearningStyleLogic } from './core/hooks/useLearningStyleLogic';
import { useLearningStyleState } from './core/hooks/useLearningStyleState';
import { LearningStyleForm } from './features/prediction-form/LearningStyleForm';
import { LearningStyleResultsView } from './features/prediction-results/LearningStyleResultsView';
import { defaultLearningStyleService } from './services/serviceFactory';

function LearningStylePredictorCore() {
    // Get state adapter (decouples from Zustand)
    const state = useLearningStyleState();

    // Get business logic (with dependency injection)
    const { handleSubmit, handleReset, loadingState } = useLearningStyleLogic({
        service: defaultLearningStyleService,
        state,
        enablePersistence: true,
        enableEvents: true,
    });

    // Show results if available
    if (state.result && state.activeTab === 'results') {
        return (
            <LearningStyleResultsView
                result={state.result}
                formData={state.formData}
                onReset={handleReset}
            />
        );
    }

    // Show form
    return (
        <LearningStyleForm
            formData={state.formData}
            isLoading={state.isLoading}
            error={state.error}
            loadingState={loadingState}
            onSubmit={handleSubmit}
            onReset={handleReset}
        />
    );
}

export function LearningStylePredictor() {
    return (
        <PredictorErrorBoundary>
            <LearningStylePredictorCore />
        </PredictorErrorBoundary>
    );
}

export default LearningStylePredictor;
