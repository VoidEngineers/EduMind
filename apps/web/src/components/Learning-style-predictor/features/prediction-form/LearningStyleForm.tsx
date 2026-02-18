/**
 * Learning Style Form Component
 * Main form for learning style analysis
 */

import type { LoadingState } from '@/components/common/types/LoadingState';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader2, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { learningStyleSchema, type LearningStyleSchema } from '../../core/schemas/learningStyleSchema';
import type { LearningStyleFormData } from '../../core/types';

interface LearningStyleFormProps {
    formData: LearningStyleFormData;
    isLoading: boolean;
    error: string | null;
    loadingState?: LoadingState;
    onSubmit: (data: LearningStyleFormData) => void;
    onReset: () => void;
    showHeader?: boolean;
}

function FormFields({
    register,
    errors,
}: {
    register: ReturnType<typeof useForm<LearningStyleSchema>>['register'];
    errors: ReturnType<typeof useForm<LearningStyleSchema>>['formState']['errors'];
}) {
    return (
        <>
            <div className="grid gap-1.5">
                <label htmlFor="student_id" className="text-xs font-semibold uppercase tracking-wide text-slate-700">Student ID</label>
                <input
                    id="student_id"
                    type="text"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-background dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter student ID"
                    {...register('student_id')}
                />
                {errors.student_id ? <p className="text-xs font-semibold text-red-600">{errors.student_id.message}</p> : null}
            </div>         
        </>
    );
}

export function LearningStyleForm({
    formData,
    isLoading,
    error,
    loadingState,
    onSubmit,
    onReset,
    showHeader = true,
}: LearningStyleFormProps) {
    const form = useForm<LearningStyleSchema>({
        resolver: zodResolver(learningStyleSchema),
        defaultValues: formData,
    });

    useEffect(() => {
        form.reset(formData);
    }, [form, formData]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const formContent = (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <FormFields register={register} errors={errors} />

            {/* Hidden defaults for removed sections to keep schema and service contract valid */}
            <input type="hidden" {...register('prefers_diagrams', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_lectures', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_reading', { valueAsNumber: true })} />
            <input type="hidden" {...register('prefers_hands_on', { valueAsNumber: true })} />
            <input type="hidden" {...register('note_taking_style')} />
            <input type="hidden" {...register('study_environment')} />
            <input type="hidden" {...register('retention_method')} />

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div> : null}

            <div className="flex flex-wrap gap-2">
                <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
                    <span>{isLoading ? (loadingState?.message || 'Analyzing...') : 'Analyze Learning Style'}</span>
                </button>

                <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    onClick={onReset}
                >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                </button>
            </div>
        </form>
    );

    if (!showHeader) {
        return formContent;
    }

    return (
        <div className="mx-auto max-w-4xl p-4 bg-background dark:bg-slate-900 rounded-xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Learning Style Predictor</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Discover your preferred learning style to optimize your study approach.</p>
            </div>
            {formContent}
        </div>
    );
}
