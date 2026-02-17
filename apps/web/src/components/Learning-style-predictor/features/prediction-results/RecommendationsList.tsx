/**
 * Recommendations List Component
 * Displays personalized learning recommendations
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import type { LearningStyleResult } from '../../core/types';

interface RecommendationsListProps {
    result: LearningStyleResult;
}

export function RecommendationsList({ result }: RecommendationsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Personalized Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
