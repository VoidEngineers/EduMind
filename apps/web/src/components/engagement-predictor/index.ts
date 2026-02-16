/**
 * Engagement Predictor Module
 * Main entry point - exports public API
 */

// Main component
export { EngagementPredictor, default } from './EngagementPredictor';

// Core exports (types, hooks, constants)
export * from './core';

// Feature components (if needed for advanced use)
export { EngagementForm } from './features/prediction-form/EngagementForm';
export { EngagementResults } from './features/prediction-results/EngagementResults';

