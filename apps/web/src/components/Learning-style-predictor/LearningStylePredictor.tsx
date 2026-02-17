/**
 * Learning Style Predictor Component
 * Composes workflow sections and delegates orchestration to a dedicated hook.
 */

import { PredictorErrorBoundary } from '@/components/common/PredictorErrorBoundary';
import type { ILearningStyleDashboardService } from './data/interfaces';
import { useLearningStyleWorkflow } from './core/hooks/useLearningStyleWorkflow';
import { AnalysisStep } from './features/workflow/AnalysisStep';
import { LearningStyleAnalyticsSection } from './features/workflow/LearningStyleAnalyticsSection';
import { RecommendationsStep } from './features/workflow/RecommendationsStep';
import { StudentSelectionStep } from './features/workflow/StudentSelectionStep';
import { defaultLearningStyleService } from './services/serviceFactory';

interface LearningStylePredictorCoreProps {
    service: ILearningStyleDashboardService;
}

function LearningStylePredictorCore({ service }: LearningStylePredictorCoreProps) {
    const workflow = useLearningStyleWorkflow(service);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_5%_0%,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_95%_0%,rgba(14,165,233,0.12),transparent_42%),#f4f6fb] pt-20 text-slate-900">
            <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
                <section className="grid gap-4">
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
