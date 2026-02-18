import type { LoadingState } from '@/components/common/types/LoadingState';
import type { LearningStyleFormData, LearningStyleResult } from '../../core/types';
import { LearningStyleForm } from '../prediction-form/LearningStyleForm';

interface AnalysisStepProps {
    formData: LearningStyleFormData;
    isLoading: boolean;
    error: string | null;
    loadingState: LoadingState;
    result: LearningStyleResult | null;
    onSubmit: (data: LearningStyleFormData) => Promise<void>;
    onReset: () => void;
    onContinue: () => void;
}

const STYLE_LABELS: Record<keyof LearningStyleResult['style_scores'], string> = {
    visual: 'Visual',
    auditory: 'Auditory',
    reading: 'Reading',
    kinesthetic: 'Kinesthetic',
};

function buildConfidenceBadge(confidence: number): string {
    if (confidence >= 85) return 'High';
    if (confidence >= 65) return 'Medium';
    return 'Low';
}

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return '--';
    }

    return date.toLocaleString();
}

export function AnalysisStep({
    formData,
    isLoading,
    error,
    loadingState,
    result,
    onSubmit,
    onReset,
    onContinue,
}: AnalysisStepProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-background dark:bg-slate-900 p-4 shadow-sm" id="step2Card">
            <div className="mb-3">
                <div className="mb-2 inline-flex rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 px-2.5 py-1 text-xs font-semibold">Step 2</div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Learning Style Analysis</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Analyze behavioral patterns to identify learning style</p>
            </div>

            <div>
                <LearningStyleForm
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    loadingState={loadingState}
                    onSubmit={(data) => void onSubmit(data)}
                    onReset={onReset}
                    showHeader={false}
                />
            </div>

            {result ? (
                <div className="mt-4 rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-900 dark:to-slate-900 p-4" id="mlResultsCard">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Analysis Complete</h3>
                    </div>

                    <div className="mt-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Identified Learning Style</div>
                        <div className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200" id="mlPredictedStyle">{STYLE_LABELS[result.primary_style]}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Confidence:</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100" id="mlConfidence">{result.confidence}%</span>
                            <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 text-xs font-semibold" id="mlConfidenceBadge">{buildConfidenceBadge(result.confidence)}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Probability Distribution</h4>
                        <div id="probabilityBars" className="grid gap-2">
                            {Object.entries(result.style_scores).map(([style, score]) => (
                                <div key={style}>
                                    <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span>{STYLE_LABELS[style as keyof LearningStyleResult['style_scores']]}</span>
                                        <span>{score}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{ width: `${score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-background dark:bg-slate-900 p-2.5">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Method</div>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">Pattern Analysis</div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-background dark:bg-slate-900 p-2.5">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Secondary Style</div>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{STYLE_LABELS[result.secondary_style]}</div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-background dark:bg-slate-900 p-2.5">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Analyzed</div>
                            <div className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100" id="mlPredictedAt">{formatTimestamp(result.timestamp)}</div>
                        </div>
                    </div>

                    {/* <button
                        type="button"
                        className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                        onClick={onContinue}
                    >
                        <span>Get Recommendations</span>
                    </button> */}
                </div>
            ) : null}
        </section>
    );
}
