import type { StudentRiskRequest } from '../../core/services/xaiService';

export type PredictionFormProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (field: string, value: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClearDraft: () => void;
    isLoading: boolean;
    isHealthy: boolean;
}

export type FormActionsProps = {
    isLoading: boolean;
    isHealthy: boolean;
    onClearDraft: () => void;
}

export type EngagementSectionProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type HistoricalDataSectionProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (field: string, value: number) => void;
}

export type AcademicPerformanceSectionProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type StudentInfoSectionProps = {
    formData: StudentRiskRequest;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}