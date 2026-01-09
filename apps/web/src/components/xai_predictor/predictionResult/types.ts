import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';

export type PredictionResultsProps = {
    prediction: RiskPredictionResponse;
    formData: StudentRiskRequest;
    actionPlan: any[];
    theme: 'dark' | 'light';
    searchTerm: string;
    filterCategory: string;
    filterPriority: string;
    onSearchChange: (value: string) => void;
    onFilterCategoryChange: (value: string) => void;
    onFilterPriorityChange: (value: string) => void;
    onToggleComplete: (id: string) => void;
    onRemoveAction: (id: string) => void;
    onShowCustomize: () => void;
    onExportPDF: () => void;
    onShare: () => void;
    onPrint: () => void;
    onExportImage: () => void;
    onWhatIf: () => void;
    onReset: () => void;
    getProgress: () => number;
    setAriaAnnouncement: (message: string) => void;
};

export type QuickActionsProps = {
    onExportPDF: () => void;
    onShare: () => void;
    onPrint: () => void;
    onExportImage: () => void;
    onWhatIf: () => void;
    onReset: () => void;
    setAriaAnnouncement: (message: string) => void;
};

export type RiskBadgeProps = {
    riskLevel: string;
};

export type RiskGaugeProps = {
    riskScore: number;
    riskLevel: string;
    theme: 'dark' | 'light';
};

export type ProbabilitiesSectionProps = {
    probabilities: Record<string, number>;
};