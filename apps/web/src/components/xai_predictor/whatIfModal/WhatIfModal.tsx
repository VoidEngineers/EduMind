import { useState } from 'react';
import { WhatIfModalHeader } from './WhatIfModalHeader';
import { ScenarioIntro } from './ScenarioIntro';
import { ChangedMetricsSummary } from './ChangedMetricsSummary';
import { RiskComparison } from './RiskComparison';
import { ScenarioHint } from './ScenarioHint';
import { ScenarioControls } from './ScenarioControls';
import { ModalActions } from './ModalActions';
import { getRiskChange, getChangedMetrics } from './whatIfUtils';
import type { RiskPredictionResponse, StudentRiskRequest } from '../services/xaiService';
import type { WhatIfModalProps } from './types';
export function WhatIfModal({
    show,
    onClose,
    currentPrediction,
    formData,
    onSimulate
}: WhatIfModalProps) {
    const [scenarioData, setScenarioData] = useState<StudentRiskRequest>(formData);
    const [simulatedPrediction, setSimulatedPrediction] = useState<RiskPredictionResponse | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    if (!show) return null;
    const handleSliderChange = (field: keyof StudentRiskRequest, value: number) => {
        setScenarioData(prev => ({ ...prev, [field]: value }));
        setSimulatedPrediction(null);
    };
    const handleSimulate = async () => {
        setIsSimulating(true);
        try {
            const result = await onSimulate(scenarioData);
            setSimulatedPrediction(result);
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setIsSimulating(false);
        }
    };
    const handleReset = () => {
        setScenarioData(formData);
        setSimulatedPrediction(null);
    };
    const riskChange = getRiskChange(currentPrediction, simulatedPrediction);
    const changedMetrics = getChangedMetrics(formData, scenarioData);
    const hasChanges = changedMetrics.length > 0;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container what-if-modal" onClick={(e) => e.stopPropagation()}>
                <WhatIfModalHeader onClose={onClose} />
                <div className="modal-body what-if-content">
                    <ScenarioIntro />
                    <ChangedMetricsSummary changedMetrics={changedMetrics} />
                    <RiskComparison
                        currentPrediction={currentPrediction}
                        simulatedPrediction={simulatedPrediction}
                        riskChange={riskChange}
                    />
                    {!hasChanges && <ScenarioHint />}
                    <ScenarioControls
                        scenarioData={scenarioData}
                        onSliderChange={handleSliderChange}
                    />
                    <ModalActions
                        onReset={handleReset}
                        onSimulate={handleSimulate}
                        isSimulating={isSimulating}
                        hasChanges={hasChanges}
                    />
                </div>
            </div>
        </div>
    );
}