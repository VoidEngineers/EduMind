import { createContext, useContext } from 'react';
import { useActionPlan } from '../hooks/useActionPlan';
import { useAriaAnnouncements } from '../hooks/useAriaAnnouncements';
import { useCustomActionModal } from '../hooks/useCustomActionModal';
import { useFormDraft } from '../hooks/useFormDraft';
import { useModelHealth } from '../hooks/useModelHealth';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useStudentRiskPrediction } from '../hooks/useStudentRiskPrediction';
import { useToast } from '../hooks/useToast';
import { useUIActions } from '../hooks/useUIActions';
import type { StudentRiskRequest } from '../services/xaiService';
import type { XAIProviderProps } from './types';

const INITIAL_FORM_DATA: StudentRiskRequest = {
    student_id: '', avg_grade: 70, grade_consistency: 85, grade_range: 30,
    num_assessments: 8, assessment_completion_rate: 0.8, studied_credits: 60,
    num_of_prev_attempts: 0, low_performance: 0, low_engagement: 0, has_previous_attempts: 0,
};

/**
 * XAI Context - Provides all state and actions to child components
 * Eliminates prop drilling and improves decoupling
 */
const XAIContext = createContext<ReturnType<typeof useXAIState> | null>(null);

function useXAIState() {
    // Core data hooks
    const prediction = useStudentRiskPrediction();
    const modelHealth = useModelHealth();
    const toast = useToast();
    const form = useFormDraft<StudentRiskRequest>(INITIAL_FORM_DATA);
    const actionPlan = useActionPlan(prediction.prediction?.risk_level);

    // UI hooks
    const ui = useUIActions(prediction.prediction ?? null, form.formData, actionPlan.actionPlan, toast.showSuccess, toast.showError, toast.showInfo); // TODO : Check the null values
    const modal = useCustomActionModal(actionPlan.addAction, toast.showSuccess);
    const filter = useSearchFilter();
    const aria = useAriaAnnouncements(prediction.prediction ?? null, prediction.isError, prediction.error, toast.showSuccess, toast.showError); // TODO : Check the null values

    return {
        prediction,
        modelHealth,
        toast,
        form,
        actionPlan,
        ui,
        modal,
        filter,
        aria
    };
}
/**
 * Provider component that wraps the XAI feature
 */
export function XAIProvider({ children }: XAIProviderProps) {
    const state = useXAIState();
    return <XAIContext.Provider value={state}>{children}</XAIContext.Provider>;
}

/**
 * Hook to access XAI context
 * Throws error if used outside provider
 */
export function useXAI() {
    const context = useContext(XAIContext);
    if (!context) {
        throw new Error('useXAI must be used within XAIProvider');
    }
    return context;
}
