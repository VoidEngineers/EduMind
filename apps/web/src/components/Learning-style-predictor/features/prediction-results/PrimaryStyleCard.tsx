/**
 * Primary Style Card Component
 * Displays the primary learning style with confidence score
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { STYLE_COLORS, STYLE_ICONS } from '../../core/constants';
import type { LearningStyleResult } from '../../core/types';

interface PrimaryStyleCardProps {
    result: LearningStyleResult;
}

export function PrimaryStyleCard({ result }: PrimaryStyleCardProps) {
    const PrimaryIcon = result.primary_style ? STYLE_ICONS[result.primary_style] : Brain;
    const primaryStyle = result.primary_style || 'unknown';
    const colorClasses = STYLE_COLORS[primaryStyle as keyof typeof STYLE_COLORS] || 'bg-gray-100';

    return (
        <Card className="border-2 border-primary">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${colorClasses}`}>
                        <PrimaryIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <span className="text-2xl capitalize">{primaryStyle} Learner</span>
                        <Badge className="ml-3">{result.confidence}% Confidence</Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    Secondary style: <span className="capitalize font-medium">{result.secondary_style}</span>
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
