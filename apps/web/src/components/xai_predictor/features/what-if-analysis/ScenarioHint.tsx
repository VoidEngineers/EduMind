import { AlertCircle } from 'lucide-react';

export function ScenarioHint() {
    return (
        <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>Adjust the metrics below to see how changes impact the risk prediction</span>
        </div>
    );
}
