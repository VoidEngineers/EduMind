import { useCallback, useEffect, useMemo } from 'react';
import type { LoadingState } from '@/components/common/types/LoadingState';
import type { LearningStyleType, LearningStyleFormData } from '../types';
import type {
    ILearningStyleDashboardService,
    LearningStyleSystemStats,
    StruggleTopicData,
    StudentProfileSummaryData,
} from '../../data/interfaces';
import { useLearningStyleLogic } from './useLearningStyleLogic';
import { useLearningStyleState, type LearningStyleStateAdapter } from './useLearningStyleState';
import { useLearningStyleStore } from '@/store/learning-style';
import {
    STUDENT_LOOKUP_LIMIT,
    STUDENT_SUGGESTION_LIMIT,
} from '../constants/uiConfig';

export interface LearningStyleWorkflowState {
    workflowStep: 1 | 2 | 3;
    studentLookup: string;
    knownStudents: string[];
    profile: StudentProfileSummaryData | null;
    isLoadingProfile: boolean;
    topicFilter: string;
    maxRecommendations: number;
    systemStats: LearningStyleSystemStats | null;
    styleDistribution: Record<LearningStyleType, number>;
    topStruggleTopics: StruggleTopicData[];
    isStudentListOpen: boolean;
    filteredStudents: string[];
    filteredRecommendations: string[];
}

export interface LearningStyleWorkflowActions {
    setStudentLookup: (value: string) => void;
    openStudentList: () => void;
    closeStudentList: () => void;
    selectStudentSuggestion: (student: string) => void;
    loadStudentProfile: () => Promise<void>;
    submitAnalysis: (data: LearningStyleFormData) => Promise<void>;
    resetWorkflow: () => void;
    setTopicFilter: (value: string) => void;
    setMaxRecommendations: (value: number) => void;
    goToRecommendations: () => void;
}

export interface LearningStyleWorkflowController {
    state: LearningStyleStateAdapter;
    loadingState: LoadingState;
    view: LearningStyleWorkflowState;
    actions: LearningStyleWorkflowActions;
}

export function useLearningStyleWorkflow(service: ILearningStyleDashboardService): LearningStyleWorkflowController {
    const state = useLearningStyleState();
    const store = useLearningStyleStore();
    const {
        workflowStep,
        studentLookup,
        knownStudents,
        profile,
        isLoadingProfile,
        topicFilter,
        maxRecommendations,
        systemStats,
        styleDistribution,
        topStruggleTopics,
        isStudentListOpen,
        setWorkflowStep,
        setStudentLookup,
        setKnownStudents,
        setProfile,
        setIsLoadingProfile,
        setTopicFilter,
        setMaxRecommendations,
        setSystemStats,
        setStyleDistribution,
        setTopStruggleTopics,
        setStudentListOpen,
        resetWorkflowUi,
    } = store;

    const { handleSubmit, handleReset, loadingState } = useLearningStyleLogic({
        service,
        state,
        enablePersistence: true,
        enableEvents: true,
    });

    const refreshDashboardMetrics = useCallback(async () => {
        try {
            const [stats, students] = await Promise.all([
                service.getSystemStats(),
                service.listStudentIds(STUDENT_LOOKUP_LIMIT),
            ]);

            setKnownStudents(students);
            setSystemStats(stats);
            setStyleDistribution(stats.learningStyleDistribution);
            setTopStruggleTopics(stats.topStruggleTopics);
        } catch (error) {
            console.error('Failed to refresh learning style dashboard metrics', error);
        }
    }, [service, setKnownStudents, setSystemStats, setStyleDistribution, setTopStruggleTopics]);

    useEffect(() => {
        const initialize = async () => {
            await service.checkHealth().catch(() => null);
            await refreshDashboardMetrics();
        };
        void initialize();
    }, [service, refreshDashboardMetrics]);

    useEffect(() => {
        if (!state.result) return;
        setWorkflowStep(3);
        void refreshDashboardMetrics();
    }, [state.result, refreshDashboardMetrics, setWorkflowStep]);

    const filteredRecommendations = useMemo(() => {
        if (!state.result) return [];
        const byTopic = topicFilter.trim().length === 0
            ? state.result.recommendations
            : state.result.recommendations.filter((rec) =>
                rec.toLowerCase().includes(topicFilter.toLowerCase())
            );
        return byTopic.slice(0, maxRecommendations);
    }, [state.result, topicFilter, maxRecommendations]);

    const filteredStudents = useMemo(() => {
        const query = studentLookup.trim().toLowerCase();
        const matches = query.length === 0
            ? knownStudents
            : knownStudents.filter((student) => student.toLowerCase().includes(query));
        return matches.slice(0, STUDENT_SUGGESTION_LIMIT);
    }, [knownStudents, studentLookup]);

    const loadStudentProfile = useCallback(async () => {
        const studentId = (studentLookup || state.formData.student_id).trim();
        if (!studentId) {
            state.setError('Student ID is required');
            return;
        }

        setIsLoadingProfile(true);
        state.setError(null);
        state.setFormData({ ...state.formData, student_id: studentId });

        try {
            const studentProfile = await service.getStudentProfile(studentId);
            setProfile(studentProfile);
            setWorkflowStep(2);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load student profile';
            state.setError(message);
            setProfile(null);
        } finally {
            setIsLoadingProfile(false);
        }
    }, [service, setIsLoadingProfile, setProfile, setWorkflowStep, state, studentLookup]);

    const submitAnalysis = useCallback(async (data: LearningStyleFormData) => {
        await handleSubmit(data);
        await refreshDashboardMetrics();
        setWorkflowStep(3);
    }, [handleSubmit, refreshDashboardMetrics, setWorkflowStep]);

    const resetWorkflow = useCallback(() => {
        handleReset();
        resetWorkflowUi();
    }, [handleReset, resetWorkflowUi]);

    const openStudentList = useCallback(() => setStudentListOpen(true), [setStudentListOpen]);
    const closeStudentList = useCallback(() => setStudentListOpen(false), [setStudentListOpen]);
    const selectStudentSuggestion = useCallback((student: string) => {
        setStudentLookup(student);
        setStudentListOpen(false);
    }, [setStudentLookup, setStudentListOpen]);
    const goToRecommendations = useCallback(() => setWorkflowStep(3), [setWorkflowStep]);

    return {
        state,
        loadingState,
        view: {
            workflowStep,
            studentLookup,
            knownStudents,
            profile,
            isLoadingProfile,
            topicFilter,
            maxRecommendations,
            systemStats,
            styleDistribution,
            topStruggleTopics,
            isStudentListOpen,
            filteredStudents,
            filteredRecommendations,
        },
        actions: {
            setStudentLookup,
            openStudentList,
            closeStudentList,
            selectStudentSuggestion,
            loadStudentProfile,
            submitAnalysis,
            resetWorkflow,
            setTopicFilter,
            setMaxRecommendations,
            goToRecommendations,
        },
    };
}
