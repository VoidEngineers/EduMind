import { XAIPredictionOrchestrator } from './Prediction-Orchestrator/XAIPredictionOrchestrator';
import { XAIProvider } from './core/context/XAIContext';
import { XAIErrorBoundary } from './ui/error-boundary/XAIErrorBoundary';

const XAIPrediction = () => (
    <XAIErrorBoundary>
        <XAIProvider>
            <XAIPredictionOrchestrator />
        </XAIProvider>
    </XAIErrorBoundary>
);

export default XAIPrediction;
