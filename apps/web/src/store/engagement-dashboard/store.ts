import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EngagementDashboardState } from './types';

export const useEngagementDashboardStore = create<EngagementDashboardState>()(
    devtools(
        (set) => ({
            studentInput: '',
            students: [],
            stats: null,

            selectedDashboard: null,
            engagementSummary: null,
            engagementHistory: [],
            dailyMetrics: [],
            predictionFactors: [],

            error: null,
            isLoadingDashboard: false,

            systemStatus: 'checking',
            systemMessage: 'Checking service status...',

            schedule: null,
            isGeneratingSchedule: false,
            isScheduleReasoningOpen: false,

            setStudentInput: (studentInput) => set({ studentInput }, false, 'setStudentInput'),
            setStudents: (students) => set({ students }, false, 'setStudents'),
            setStats: (stats) => set({ stats }, false, 'setStats'),

            setSelectedDashboard: (selectedDashboard) => set({ selectedDashboard }, false, 'setSelectedDashboard'),
            setEngagementSummary: (engagementSummary) => set({ engagementSummary }, false, 'setEngagementSummary'),
            setEngagementHistory: (engagementHistory) => set({ engagementHistory }, false, 'setEngagementHistory'),
            setDailyMetrics: (dailyMetrics) => set({ dailyMetrics }, false, 'setDailyMetrics'),
            setPredictionFactors: (predictionFactors) => set({ predictionFactors }, false, 'setPredictionFactors'),

            setError: (error) => set({ error }, false, 'setError'),
            setIsLoadingDashboard: (isLoadingDashboard) => set({ isLoadingDashboard }, false, 'setIsLoadingDashboard'),

            setSystemStatus: (systemStatus) => set({ systemStatus }, false, 'setSystemStatus'),
            setSystemMessage: (systemMessage) => set({ systemMessage }, false, 'setSystemMessage'),

            setSchedule: (schedule) => set({ schedule }, false, 'setSchedule'),
            setIsGeneratingSchedule: (isGeneratingSchedule) => set({ isGeneratingSchedule }, false, 'setIsGeneratingSchedule'),
            toggleScheduleReasoning: () => set((state) => ({ isScheduleReasoningOpen: !state.isScheduleReasoningOpen }), false, 'toggleScheduleReasoning'),

            resetSchedulePanel: () => set({ schedule: null, isScheduleReasoningOpen: false }, false, 'resetSchedulePanel'),
            clearDashboardData: () => set({
                selectedDashboard: null,
                engagementSummary: null,
                engagementHistory: [],
                dailyMetrics: [],
                predictionFactors: [],
            }, false, 'clearDashboardData'),
        }),
        { name: 'EngagementDashboardStore' }
    )
);
