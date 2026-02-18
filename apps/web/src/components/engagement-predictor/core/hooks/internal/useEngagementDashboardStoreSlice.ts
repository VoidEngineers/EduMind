import { useEngagementDashboardStore } from '@/store/engagement-dashboard';
import { useShallow } from 'zustand/react/shallow';

export function useEngagementDashboardStoreSlice() {
    return useEngagementDashboardStore(
        useShallow((state) => ({
            studentInput: state.studentInput,
            students: state.students,
            stats: state.stats,
            selectedDashboard: state.selectedDashboard,
            engagementSummary: state.engagementSummary,
            engagementHistory: state.engagementHistory,
            dailyMetrics: state.dailyMetrics,
            predictionFactors: state.predictionFactors,
            error: state.error,
            isLoadingDashboard: state.isLoadingDashboard,
            systemStatus: state.systemStatus,
            systemMessage: state.systemMessage,
            schedule: state.schedule,
            isGeneratingSchedule: state.isGeneratingSchedule,
            isScheduleReasoningOpen: state.isScheduleReasoningOpen,

            setStudentInput: state.setStudentInput,
            setStudents: state.setStudents,
            setStats: state.setStats,
            setSelectedDashboard: state.setSelectedDashboard,
            setEngagementSummary: state.setEngagementSummary,
            setEngagementHistory: state.setEngagementHistory,
            setDailyMetrics: state.setDailyMetrics,
            setPredictionFactors: state.setPredictionFactors,
            setError: state.setError,
            setIsLoadingDashboard: state.setIsLoadingDashboard,
            setSystemStatus: state.setSystemStatus,
            setSystemMessage: state.setSystemMessage,
            setSchedule: state.setSchedule,
            setIsGeneratingSchedule: state.setIsGeneratingSchedule,
            toggleScheduleReasoning: state.toggleScheduleReasoning,
            resetSchedulePanel: state.resetSchedulePanel,
            clearDashboardData: state.clearDashboardData,
        }))
    );
}

export type EngagementDashboardStoreSlice = ReturnType<typeof useEngagementDashboardStoreSlice>;
