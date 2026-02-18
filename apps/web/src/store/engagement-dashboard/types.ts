import type {
    DailyMetricItem,
    EngagementHistoryItem,
    EngagementSummaryResponse,
    StudentDashboardResponse,
    StudentListItem,
    SystemStatus,
    SystemStatsResponse,
    UiSchedule,
} from '@/components/engagement-predictor/core/types/dashboard';

export interface EngagementDashboardState {
    studentInput: string;
    students: StudentListItem[];
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

    setStudentInput: (value: string) => void;
    setStudents: (students: StudentListItem[]) => void;
    setStats: (stats: SystemStatsResponse | null) => void;

    setSelectedDashboard: (dashboard: StudentDashboardResponse | null) => void;
    setEngagementSummary: (summary: EngagementSummaryResponse | null) => void;
    setEngagementHistory: (history: EngagementHistoryItem[]) => void;
    setDailyMetrics: (metrics: DailyMetricItem[]) => void;
    setPredictionFactors: (factors: string[]) => void;

    setError: (error: string | null) => void;
    setIsLoadingDashboard: (value: boolean) => void;

    setSystemStatus: (status: SystemStatus) => void;
    setSystemMessage: (message: string) => void;

    setSchedule: (schedule: UiSchedule | null) => void;
    setIsGeneratingSchedule: (value: boolean) => void;
    toggleScheduleReasoning: () => void;
    resetSchedulePanel: () => void;
    clearDashboardData: () => void;
}
