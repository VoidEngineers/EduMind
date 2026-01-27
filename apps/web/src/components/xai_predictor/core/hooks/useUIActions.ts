import { useState } from 'react';
import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';
import { xaiService } from '../services/xaiService';
import { exportPredictionToPDF } from '../../utils/exportPDF';

/**
 * Hook to manage all UI actions (export, share, theme, etc.)
 */
export function useUIActions(
    prediction: RiskPredictionResponse | null,
    formData: StudentRiskRequest,
    actionPlan: any[],
    showSuccess: (msg: string) => void,
    showError: (msg: string) => void,
    showInfo: (msg: string) => void
) {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [shareLink, setShareLink] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showWhatIfModal, setShowWhatIfModal] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        showInfo(`Switched to ${newTheme} mode`);
    };

    const handleExportPDF = () => {
        if (prediction) {
            exportPredictionToPDF(prediction, formData, actionPlan);
            showSuccess('Report ready to save as PDF');
        }
    };

    const handleShare = () => {
        if (!prediction) return;
        const data = {
            studentId: formData.student_id,
            riskLevel: prediction.risk_level,
            riskScore: prediction.risk_score,
            confidence: prediction.confidence,
            timestamp: new Date().toISOString()
        };
        const encoded = btoa(JSON.stringify(data));
        const link = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
        setShareLink(link);
        setShowShareModal(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            showSuccess('Link copied to clipboard!');
        } catch (err) {
            showError('Failed to copy link');
        }
    };

    const closeShareModal = () => setShowShareModal(false);

    const openWhatIfModal = () => setShowWhatIfModal(true);
    const closeWhatIfModal = () => setShowWhatIfModal(false);

    const simulateScenario = async (scenarioData: StudentRiskRequest): Promise<RiskPredictionResponse> => {
        try {
            const result = await xaiService.predictRisk(scenarioData);
            showSuccess('Scenario simulated successfully!');
            return result;
        } catch (error) {
            showError('Failed to simulate scenario');
            throw error;
        }
    };

    return {
        theme,
        shareLink,
        showShareModal,
        showWhatIfModal,
        toggleTheme,
        handleExportPDF,
        handleShare,
        copyToClipboard,
        closeShareModal,
        openWhatIfModal,
        closeWhatIfModal,
        simulateScenario
    };
}
