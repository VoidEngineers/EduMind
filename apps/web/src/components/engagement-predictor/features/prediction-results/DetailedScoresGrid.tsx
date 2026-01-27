import { Card, CardContent } from '@/components/ui/card';
import type { EngagementResult } from '@/store/engagementStore';
import { BookOpen, Clock, Target, Users } from 'lucide-react';

interface DetailedScoresGridProps {
    scores: EngagementResult['detailed_scores'];
}

export function DetailedScoresGrid({ scores }: DetailedScoresGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{scores.academic}%</div>
                    <div className="text-sm text-muted-foreground">Academic</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">{scores.social}%</div>
                    <div className="text-sm text-muted-foreground">Social</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6 text-center">
                    <Clock className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{scores.behavioral}%</div>
                    <div className="text-sm text-muted-foreground">Behavioral</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6 text-center">
                    <Target className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                    <div className="text-2xl font-bold">{scores.content}%</div>
                    <div className="text-sm text-muted-foreground">Content</div>
                </CardContent>
            </Card>
        </div>
    );
}
