import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { ChangedMetricsSummaryProps } from './types';

export function ChangedMetricsSummary({ changedMetrics }: ChangedMetricsSummaryProps) {
    if (changedMetrics.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Modified Metrics ({changedMetrics.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {changedMetrics.map(({ label, original, modified, change, unit }) => (
                    <Card key={label} className="bg-muted/20 border-l-4 border-l-cyan-500">
                        <CardContent className="p-3">
                            <div className="text-sm font-medium text-foreground mb-2">{label}</div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">{original.toFixed(1)}{unit}</span>
                                    <ArrowRight size={14} className="text-cyan-500" />
                                    <span className="font-bold text-foreground">{modified.toFixed(1)}{unit}</span>
                                </div>
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
