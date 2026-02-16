import { XAIPredictionOrchestrator } from './Prediction-Orchestrator/XAIPredictionOrchestrator';
import { XAIErrorBoundary } from './ui/error-boundary/XAIErrorBoundary';

const XAIPrediction = () => (
    <XAIErrorBoundary>
        <XAIPredictionOrchestrator />
    </XAIErrorBoundary>
);

export default XAIPrediction;
