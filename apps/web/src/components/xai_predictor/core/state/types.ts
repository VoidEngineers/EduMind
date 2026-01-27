import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';

export type ActionItem = {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'standard';
    category: 'academic' | 'engagement' | 'time-management' | 'support';
    isCompleted: boolean;
    isCustom?: boolean;
}


export type FormStateProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onClearDraft: () => void;
    isLoading: boolean;
    isHealthy: boolean;
}

export type ResultsStateProps = {
    prediction: RiskPredictionResponse;
    formData: StudentRiskRequest;
    actionPlan: ActionItem[];
    theme: 'light' | 'dark';
    searchTerm: string;
    filterCategory: string;
    filterPriority: string;
    onSearchChange: (term: string) => void;
    onFilterCategoryChange: (category: string) => void;
    onFilterPriorityChange: (priority: string) => void;
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
}

export type XaiFormStateProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onClearDraft: () => void;
    isLoading: boolean;
    isHealthy: boolean;
}
export type XaiResultsStateProps = {
    prediction: RiskPredictionResponse;
    formData: StudentRiskRequest;
    actionPlan: ActionItem[];
    theme: 'light' | 'dark';
    searchTerm: string;
    filterCategory: string;
    filterPriority: string;
    onSearchChange: (term: string) => void;
    onFilterCategoryChange: (category: string) => void;
    onFilterPriorityChange: (priority: string) => void;
    onToggleComplete: (id: string) => void;
    onRemoveAction: (id: string) => void;
    onShowCustomize: () => void;
    onExportPDF: () => void;
    onShare: () => void;
    onPrint: () => void;
    onExportImage: () => void;
    onWhatIf: () => void;
    onReset: () => void;
    getProgress: () => number; // Returns percentage as number
    setAriaAnnouncement: (message: string) => void;
}