import { useMemo } from 'react';
import type {
    DailyMetricItem,
    EngagementHistoryItem,
    EngagementSummaryResponse,
    QuickStudent,
    StudentDashboardResponse,
    StudentListItem,
    SystemStatus,
    SystemStatsResponse,
    UiSchedule,
} from '../types/dashboard';
import { deriveQuickStudents } from '../utils/engagementDashboardMappers';
import { useEngagementDashboardActions } from './internal/useEngagementDashboardActions';
import { useEngagementDashboardBootstrap } from './internal/useEngagementDashboardBootstrap';
import { useEngagementDashboardStoreSlice } from './internal/useEngagementDashboardStoreSlice';

export interface EngagementDashboardWorkflowView {
    studentInput: string;
    students: StudentListItem[];
    quickStudents: QuickStudent[];
    stats: SystemStatsResponse | null;

    selectedDashboard: StudentDashboardResponse | null;
    engagementSummary: EngagementSummaryResponse | null;
    engagementHistory: EngagementHistoryItem[];
    dailyMetrics: DailyMetricItem[];
    predictionFactors: string[];

    error: string | null;
    isLoadingDashboard: boolean;

    systemStatus: SystemStatus;
    systemMessage: string;

    schedule: UiSchedule | null;
    isGeneratingSchedule: boolean;
    isScheduleReasoningOpen: boolean;
}

export interface EngagementDashboardWorkflowActions {
    setStudentInput: (value: string) => void;
    loadStudentDashboard: (forcedStudentId?: string) => Promise<void>;
    generateStudentSchedule: () => Promise<void>;
    toggleScheduleReasoning: () => void;
}

export interface EngagementDashboardWorkflowController {
    view: EngagementDashboardWorkflowView;
    actions: EngagementDashboardWorkflowActions;
}

export function useEngagementDashboardWorkflow(): EngagementDashboardWorkflowController {
    const store = useEngagementDashboardStoreSlice();

    useEngagementDashboardBootstrap({
        setSystemStatus: store.setSystemStatus,
        setSystemMessage: store.setSystemMessage,
        setStats: store.setStats,
        setStudents: store.setStudents,
        setError: store.setError,
    });

    const { loadStudentDashboard, generateStudentSchedule } = useEngagementDashboardActions({
        studentInput: store.studentInput,
        selectedDashboard: store.selectedDashboard,
        setStudentInput: store.setStudentInput,
        setSelectedDashboard: store.setSelectedDashboard,
        setEngagementSummary: store.setEngagementSummary,
        setEngagementHistory: store.setEngagementHistory,
        setDailyMetrics: store.setDailyMetrics,
        setPredictionFactors: store.setPredictionFactors,
        setError: store.setError,
        setIsLoadingDashboard: store.setIsLoadingDashboard,
        setSchedule: store.setSchedule,
        setIsGeneratingSchedule: store.setIsGeneratingSchedule,
        resetSchedulePanel: store.resetSchedulePanel,
        clearDashboardData: store.clearDashboardData,
    });

    const quickStudents = useMemo(() => {
        const average = store.stats?.avg_engagement_score ?? 50;
        return deriveQuickStudents(store.students, average);
    }, [store.stats?.avg_engagement_score, store.students]);

    return {
        view: {
            studentInput: store.studentInput,
            students: store.students,
            quickStudents,
            stats: store.stats,
            selectedDashboard: store.selectedDashboard,
            engagementSummary: store.engagementSummary,
            engagementHistory: store.engagementHistory,
            dailyMetrics: store.dailyMetrics,
            predictionFactors: store.predictionFactors,
            error: store.error,
            isLoadingDashboard: store.isLoadingDashboard,
            systemStatus: store.systemStatus,
            systemMessage: store.systemMessage,
            schedule: store.schedule,
            isGeneratingSchedule: store.isGeneratingSchedule,
            isScheduleReasoningOpen: store.isScheduleReasoningOpen,
        },
        actions: {
            setStudentInput: store.setStudentInput,
            loadStudentDashboard,
            generateStudentSchedule,
            toggleScheduleReasoning: store.toggleScheduleReasoning,
        },
    };
}
