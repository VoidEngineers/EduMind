import { useXAIStore } from '@/store/xaiStore';
import { createContext, useCallback, useContext, useState } from 'react';
import { useModelHealth } from '../hooks/useModelHealth';
import { useStudentRiskPrediction } from '../hooks/useStudentRiskPrediction';
import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';
import { xaiService } from '../services/xaiService';
import type { XAIProviderProps } from './types';

/**
 * XAI Context - Thin wrapper around Zustand store + React Query hooks
 */

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

// Default form data to ensure all fields exist
const DEFAULT_FORM_DATA: StudentRiskRequest = {
    student_id: '',
    avg_grade: 70,
    grade_consistency: 85,
    grade_range: 30,
    num_assessments: 8,
    assessment_completion_rate: 0.8,
    studied_credits: 60,
    num_of_prev_attempts: 0,
    low_performance: 0,
    low_engagement: 0,
    has_previous_attempts: 0,
};

function useXAIState() {
    // Zustand store for all UI state
    const store = useXAIStore();

    // Local toast state (ephemeral, doesn't need global state)
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'info',
    });

    // Local aria state
    const [ariaAnnouncement, setAriaAnnouncement] = useState('');

    // React Query hooks for async operations
    const prediction = useStudentRiskPrediction();
    const modelHealth = useModelHealth();

    // Toast functions
    const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    }, []);

    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    // Ensure formData always has all fields with fallback defaults
    const safeFormData: StudentRiskRequest = {
        ...DEFAULT_FORM_DATA,
        ...(store.formData || {}),
    };

    // Form object - delegates to Zustand store
    const form = {
        formData: safeFormData,
        setFormData: store.setFormData,
        updateFormData: store.updateFormData,
        clearDraft: store.clearDraft,
        resetForm: store.resetForm,
    };

    // Action plan object - delegates to Zustand store
    const actionPlan = {
        actionPlan: store.actionPlan || [],
        addAction: store.addAction,
        removeAction: store.removeAction,
        toggleComplete: store.toggleActionComplete,
        getProgress: store.getProgress,
        getFilteredActions: store.getFilteredActions,
    };

    // Filter object - delegates to Zustand store
    const safeFilters = store.filters || { priorities: [], categories: [], showCompleted: true };
    const filter = {
        searchTerm: store.searchQuery || '',
        setSearchTerm: store.setSearchQuery,
        filterCategory: safeFilters.categories[0] || 'all',
        setFilterCategory: (cat: string) => store.updateFilters({ categories: cat && cat !== 'all' ? [cat] : [] }),
        filterPriority: safeFilters.priorities[0] || 'all',
        setFilterPriority: (priority: string) => store.updateFilters({ priorities: priority && priority !== 'all' ? [priority] : [] }),
    };

    // Modal object - delegates to Zustand store
    const safeNewActionItem = store.newActionItem || { title: '', description: '', priority: 'standard', category: 'academic' };
    const modal = {
        showCustomizeModal: store.isCustomActionModalOpen || false,
        newActionItem: safeNewActionItem,
        openModal: () => store.setCustomActionModalOpen(true),
        closeModal: () => {
            store.setCustomActionModalOpen(false);
            store.resetNewActionItem();
        },
        updateTitle: (title: string) => store.updateNewActionItem('title', title),
        updateDescription: (desc: string) => store.updateNewActionItem('description', desc),
        updatePriority: (priority: string) => store.updateNewActionItem('priority', priority as 'critical' | 'high' | 'medium' | 'standard'),
        updateCategory: (category: string) => store.updateNewActionItem('category', category as 'academic' | 'engagement' | 'time-management' | 'support'),
        addCustomAction: () => {
            store.submitNewAction();
            showSuccess('Custom action added to your plan');
        },
    };

    // UI object - delegates to Zustand store
    const ui = {
        theme: store.theme || 'light',
        toggleTheme: () => {
            const newTheme = (store.theme || 'light') === 'light' ? 'dark' : 'light';
            store.setTheme(newTheme);
            showInfo(`Switched to ${newTheme} mode`);
        },
        shareLink: store.shareLink || '',
        showShareModal: store.isShareModalOpen || false,
        showWhatIfModal: store.isWhatIfModalOpen || false,
        openWhatIfModal: () => store.setWhatIfModalOpen(true),
        closeWhatIfModal: () => store.setWhatIfModalOpen(false),
        closeShareModal: () => store.setShareModalOpen(false),
        handleShare: () => {
            if (!prediction.prediction) return;
            const data = {
                studentId: safeFormData.student_id,
                riskLevel: prediction.prediction.risk_level,
                riskScore: prediction.prediction.risk_score,
                confidence: prediction.prediction.confidence,
                timestamp: new Date().toISOString()
            };
            const encoded = btoa(JSON.stringify(data));
            const link = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
            store.setShareLink(link);
            store.setShareModalOpen(true);
        },
        copyToClipboard: async () => {
            try {
                await navigator.clipboard.writeText(store.shareLink || '');
                showSuccess('Link copied to clipboard!');
            } catch {
                showError('Failed to copy link');
            }
        },
        handleExportPDF: async () => {
            if (prediction.prediction) {
                const { exportPredictionToPDF } = await import('../../utils/exportPDF');
                exportPredictionToPDF(prediction.prediction, safeFormData, store.actionPlan || []);
                showSuccess('Report ready to save as PDF');
            }
        },
        simulateScenario: async (scenarioData: StudentRiskRequest): Promise<RiskPredictionResponse> => {
            try {
                const result = await xaiService.predictRisk(scenarioData);
                showSuccess('Scenario simulated successfully!');
                return result;
            } catch {
                showError('Failed to simulate scenario');
                throw new Error('Simulation failed');
            }
        },
    };

    // Aria object
    const aria = {
        ariaAnnouncement,
        setAriaAnnouncement,
        announceLoading: () => setAriaAnnouncement('Analyzing student data. Please wait.'),
        announceError: () => setAriaAnnouncement('Prediction failed. Please try again.'),
        announceReset: () => setAriaAnnouncement('Prediction cleared. Ready for new prediction.'),
    };

    // Toast object
    const toastObj = {
        toast,
        showToast,
        showSuccess,
        showError,
        showInfo,
        hideToast: () => setToast(prev => ({ ...prev, show: false })),
    };

    return {
        prediction,
        modelHealth,
        toast: toastObj,
        form,
        actionPlan,
        ui,
        modal,
        filter,
        aria,
        store, // Direct access to Zustand store
    };
}

type XAIContextType = ReturnType<typeof useXAIState>;
const XAIContext = createContext<XAIContextType | null>(null);

/**
 * Provider component that wraps the XAI feature
 * This is a thin wrapper that combines Zustand store with React Query
 */
export function XAIProvider({ children }: XAIProviderProps) {
    const state = useXAIState();
    return <XAIContext.Provider value={state}>{children}</XAIContext.Provider>;
}

/**
 * Hook to access XAI context
 */
export function useXAI() {
    const context = useContext(XAIContext);
    if (!context) {
        throw new Error('useXAI must be used within XAIProvider');
    }
    return context;
}

// Re-export the Zustand store hook for direct access
export { useXAIStore } from '@/store/xaiStore';
