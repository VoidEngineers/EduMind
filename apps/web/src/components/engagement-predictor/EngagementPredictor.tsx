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
        form,
        result,
        interventions,
        activeTab,
        error,
        isSubmitting,
        progress,
        onSubmit,
        handleReset,
        handleToggleIntervention
    } = useEngagementLogic();

    // Show results if available
    if (result && activeTab === 'results') {
        const currentFormData = form.getValues(); // Get latest form data for results view if needed
        return (
            <EngagementResults
                result={result}
                interventions={interventions}
                progress={progress}
                studentId={currentFormData.student_id}
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
                form={form}
                onSubmit={onSubmit}
                onReset={handleReset}
                isSubmitting={isSubmitting}
                error={error}
            />
        </div>
    );
}

export default EngagementPredictor;
