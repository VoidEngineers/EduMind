import { Brain } from 'lucide-react';
import { FormActions } from './FormActions';
import { AcademicPerformanceSection } from './AcademicPerformanceSection';
import { EngagementSection } from './EngagementSection';
import { HistoricalDataSection } from './HistoricalDataSection';
import { StudentInfoSection } from './StudentInfoSection';
import type { PredictionFormProps } from './types';

export function PredictionForm({
    formData,
    onInputChange,
    onSelectChange,
    onSubmit,
    onClearDraft,
    isLoading,
    isHealthy
}: PredictionFormProps) {
    return (
        <div className="xai-form">
            <div className="form-header">
                <div className="form-header-icon">
                    <Brain size={32} />
                </div>
                <div>
                    <h2>Student Risk Assessment</h2>
                    <p>Complete the form below to predict academic risk level</p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <StudentInfoSection 
                    formData={formData} 
                    onInputChange={onInputChange} 
                />
                
                <AcademicPerformanceSection 
                    formData={formData} 
                    onInputChange={onInputChange} 
                />
                
                <EngagementSection 
                    formData={formData} 
                    onInputChange={onInputChange} 
                />
                
                <HistoricalDataSection 
                    formData={formData} 
                    onInputChange={onInputChange} 
                    onSelectChange={onSelectChange}
                />
                
                <FormActions 
                    isLoading={isLoading} 
                    isHealthy={isHealthy} 
                    onClearDraft={onClearDraft} 
                />
            </form>
        </div>
    );
}