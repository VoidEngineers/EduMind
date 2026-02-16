import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { levelColors, levelLabels } from '../../core/constants';
import type { EngagementResult } from '../../core/types';

interface EngagementScoreCardProps {
    result: EngagementResult;
}

const trendIcons = {
    improving: TrendingUp,
    stable: Minus,
    declining: TrendingDown,
};

export function EngagementScoreCard({ result }: EngagementScoreCardProps) {
    const level = result.engagement_level || 'at_risk';
    const TrendIcon = trendIcons[result.trend];

    return (
        <Card className={`border-2 ${levelColors[level]}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold">{result.engagement_score}</div>
                        <div>
                            <CardTitle className="text-2xl">{levelLabels[level]}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <TrendIcon className="h-4 w-4" />
                                Trend: <span className="capitalize">{result.trend}</span>
                            </CardDescription>
                        </div>
                    </div>
                    <div className={`p-4 rounded-full ${levelColors[level]}`}>
                        <Activity className="h-12 w-12" />
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
