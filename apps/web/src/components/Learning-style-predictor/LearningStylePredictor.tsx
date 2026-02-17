/**
 * Learning Style Predictor Component
 * Composes workflow sections and delegates orchestration to a dedicated hook.
 */

import { PredictorErrorBoundary } from '@/components/common/PredictorErrorBoundary';
import { defaultLearningStyleService } from './services/serviceFactory';
import type { ILearningStyleDashboardService } from './data/interfaces';
import { useLearningStyleWorkflow } from './core/hooks/useLearningStyleWorkflow';
import { StudentSelectionStep } from './features/workflow/StudentSelectionStep';
import { AnalysisStep } from './features/workflow/AnalysisStep';
import { RecommendationsStep } from './features/workflow/RecommendationsStep';
import { LearningStyleAnalyticsSection } from './features/workflow/LearningStyleAnalyticsSection';

interface LearningStylePredictorCoreProps {
    service: ILearningStyleDashboardService;
}

function LearningStylePredictorCore({ service }: LearningStylePredictorCoreProps) {
    const workflow = useLearningStyleWorkflow(service);

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto w-full max-w-4xl space-y-6">
                    <StudentSelectionStep
                        studentLookup={workflow.view.studentLookup}
                        filteredStudents={workflow.view.filteredStudents}
                        isStudentListOpen={workflow.view.isStudentListOpen}
                        profile={workflow.view.profile}
                        isLoadingProfile={workflow.view.isLoadingProfile}
                        onStudentLookupChange={workflow.actions.setStudentLookup}
                        onOpenStudentList={workflow.actions.openStudentList}
                        onCloseStudentList={workflow.actions.closeStudentList}
                        onSelectStudent={workflow.actions.selectStudentSuggestion}
                        onLoadStudentProfile={workflow.actions.loadStudentProfile}
                    />

                    {workflow.view.workflowStep >= 2 ? (
                        <AnalysisStep
                            formData={workflow.state.formData}
                            isLoading={workflow.state.isLoading}
                            error={workflow.state.error}
                            loadingState={workflow.loadingState}
                            result={workflow.state.result}
                            onSubmit={workflow.actions.submitAnalysis}
                            onReset={workflow.actions.resetWorkflow}
                            onContinue={workflow.actions.goToRecommendations}
                        />
                    ) : null}

                    {workflow.view.workflowStep >= 3 && workflow.state.result ? (
                        <RecommendationsStep
                            topicFilter={workflow.view.topicFilter}
                            maxRecommendations={workflow.view.maxRecommendations}
                            filteredRecommendations={workflow.view.filteredRecommendations}
                            onTopicFilterChange={workflow.actions.setTopicFilter}
                            onMaxRecommendationsChange={workflow.actions.setMaxRecommendations}
                        />
                    ) : null}
                </section>

                <LearningStyleAnalyticsSection
                    styleDistribution={workflow.view.styleDistribution}
                    topStruggleTopics={workflow.view.topStruggleTopics}
                />
            </main>
        </div>
    );
}

export interface LearningStylePredictorProps {
    service?: ILearningStyleDashboardService;
}

export function LearningStylePredictor({ service = defaultLearningStyleService }: LearningStylePredictorProps) {
    return (
        <PredictorErrorBoundary>
            <LearningStylePredictorCore service={service} />
        </PredictorErrorBoundary>
    );
}

export default LearningStylePredictor;
