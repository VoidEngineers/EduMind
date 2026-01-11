import { Download, Image, Printer, RefreshCw, Share2, Sliders } from 'lucide-react';
import type { QuickActionsProps } from './types';

export function QuickActions({
    onExportPDF,
    onShare,
    onPrint,
    onExportImage,
    onWhatIf,
    onReset,
    setAriaAnnouncement
}: QuickActionsProps) {
    return (
        <div className="quick-actions">
            <button className="action-button primary" onClick={onExportPDF} aria-label="Export report as PDF">
                <Download size={18} />
                <span>Export PDF</span>
            </button>
            <button className="action-button secondary" onClick={onShare} aria-label="Share prediction report">
                <Share2 size={18} />
                <span>Share</span>
            </button>
            <button className="action-button secondary" onClick={onPrint} aria-label="Print prediction report">
                <Printer size={18} />
                <span>Print</span>
            </button>
            <button className="action-button secondary" onClick={onExportImage} aria-label="Export report as image">
                <Image size={18} />
                <span>Screenshot</span>
            </button>
            <button className="action-button what-if" onClick={onWhatIf} aria-label="Open what-if scenario simulator">
                <Sliders size={18} />
                <span>What-If</span>
            </button>
            <button
                className="action-button secondary"
                onClick={() => {
                    onReset();
                    setAriaAnnouncement('Prediction cleared. Ready for new prediction.');
                }}
                aria-label="Start new prediction"
            >
                <RefreshCw size={18} />
                <span>New Prediction</span>
            </button>
        </div>
    );
}