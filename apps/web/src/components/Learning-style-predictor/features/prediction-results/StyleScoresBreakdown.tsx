/**
 * Style Scores Breakdown Component
 * Visualizes all learning style scores
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { STYLE_ICONS } from '../../core/constants';
import type { LearningStyleResult } from '../../core/types';

interface StyleScoresBreakdownProps {
    result: LearningStyleResult;
}

export function StyleScoresBreakdown({ result }: StyleScoresBreakdownProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Style Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(result.style_scores).map(([style, score]) => {
                    const Icon = STYLE_ICONS[style as keyof typeof STYLE_ICONS];
                    return (
                        <div key={style} className="flex items-center gap-4">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="capitalize w-24">{style}</span>
                            <Progress value={score} className="flex-1" />
                            <span className="w-12 text-right font-medium">{score}%</span>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
