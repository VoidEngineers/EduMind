import { AlertCircle } from 'lucide-react';

export function ScenarioHint() {
    return (
        <div className="scenario-hint">
            <AlertCircle size={20} />
            <span>Adjust the metrics below to see how changes impact the risk prediction</span>
        </div>
    );
}
