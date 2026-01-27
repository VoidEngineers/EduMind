import { Sliders, X } from 'lucide-react';
import type { WhatIfModalHeaderProps } from './types';

export function WhatIfModalHeader({ onClose }: WhatIfModalHeaderProps) {
    return (
        <div className="modal-header">
            <div className="modal-title-group">
                <Sliders size={24} />
                <h2>What-If Scenario Simulator</h2>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
                <X size={24} />
            </button>
        </div>
    );
}
