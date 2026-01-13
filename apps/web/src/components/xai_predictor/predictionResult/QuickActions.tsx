import { Button } from '@/components/ui/button';
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
        <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" onClick={onExportPDF} aria-label="Export report as PDF" title="Export PDF" className="text-foreground">
                <Download size={16} />
                <span className="sr-only">Export PDF</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onShare} aria-label="Share prediction report" title="Share" className="text-foreground">
                <Share2 size={16} />
                <span className="sr-only">Share</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onPrint} aria-label="Print prediction report" title="Print" className="text-foreground">
                <Printer size={16} />
                <span className="sr-only">Print</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onExportImage} aria-label="Export report as image" title="Screenshot" className="text-foreground">
                <Image size={16} />
                <span className="sr-only">Screenshot</span>
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
                variant="default" // Changed to default to ensure visibility
                size="sm"
                onClick={onWhatIf}
                aria-label="Open what-if scenario simulator"
                className="flex items-center gap-2"
            >
                <Sliders size={16} />
                <span className="hidden sm:inline">What-If</span>
            </Button>
            <Button
                variant="default"
                size="sm"
                onClick={() => {
                    onReset();
                    setAriaAnnouncement('Prediction cleared. Ready for new prediction.');
                }}
                aria-label="Start new prediction"
                className="flex items-center gap-2"
            >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">New Prediction</span>
            </Button>
        </div>
    );
}