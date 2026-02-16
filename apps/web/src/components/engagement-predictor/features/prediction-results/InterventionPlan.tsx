import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import type { InterventionItem } from '../../core/types';

interface InterventionPlanProps {
    interventions: InterventionItem[];
    progress: number;
    onToggleComplete: (id: string) => void;
}

export function InterventionPlan({ interventions, progress, onToggleComplete }: InterventionPlanProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Intervention Plan
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-24" />
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {interventions.map((intervention) => (
                        <li
                            key={intervention.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${intervention.isCompleted ? 'bg-muted/50' : 'bg-background'
                                }`}
                        >
                            <Checkbox
                                checked={intervention.isCompleted}
                                onCheckedChange={() => onToggleComplete(intervention.id)}
                            />
                            <div className="flex-1">
                                <div className={`font-medium ${intervention.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                    {intervention.title}
                                </div>
                                <div className="text-sm text-muted-foreground">{intervention.description}</div>
                            </div>
                            <Badge variant={
                                intervention.priority === 'urgent' ? 'destructive' :
                                    intervention.priority === 'high' ? 'default' : 'secondary'
                            }>
                                {intervention.priority}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
