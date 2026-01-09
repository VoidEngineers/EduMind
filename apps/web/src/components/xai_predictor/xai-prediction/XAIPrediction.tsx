import { XAIPredictionOrchestrator } from '../Prediction-Orchestrator/XAIPredictionOrchestrator';
import { XAIProvider } from '../contexts/XAIContext';
import { XAIErrorBoundary } from '../xaiErrorBoundary/XAIErrorBoundary';
import './XAIPrediction.css';

const XAIPrediction = () => (
    <XAIErrorBoundary>
        <XAIProvider>
            <XAIPredictionOrchestrator />
        </XAIProvider>
    </XAIErrorBoundary>
);

export default XAIPrediction;
