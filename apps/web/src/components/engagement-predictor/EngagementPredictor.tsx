/**
 * Engagement Predictor Component
 * Main entry point for student engagement predictions
 */

import { Activity } from 'lucide-react';
import { useEngagementLogic } from './core/hooks/useEngagementLogic';
import { EngagementForm } from './features/prediction-form/EngagementForm';
import { EngagementResults } from './features/prediction-results/EngagementResults';

export function EngagementPredictor() {
    const {
        // State
        formData,
        result,
        interventions,
        activeTab,
        error,
        isSubmitting,
        progress,

        // Handlers
        handleInputChange,
        handleSliderChange,
        handleSubmit,
        handleReset,
        handleToggleIntervention
    } = useEngagementLogic();

    // Show results if available
    if (result && activeTab === 'results') {
        return (
            <EngagementResults
                result={result}
                interventions={interventions}
                progress={progress}
                studentId={formData.student_id}
                onReset={handleReset}
                onToggleIntervention={handleToggleIntervention}
            />
        );
    }

    // Show form
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary" />
                    Engagement Predictor
                </h1>
                <p className="text-muted-foreground mt-2">
                    Analyze student engagement levels and identify areas for improvement
                </p>
            </div>

            <EngagementForm
                formData={formData}
                onInputChange={handleInputChange}
                onSliderChange={handleSliderChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isSubmitting={isSubmitting}
                error={error}
            />
        </div>
    );
}

export default EngagementPredictor;
