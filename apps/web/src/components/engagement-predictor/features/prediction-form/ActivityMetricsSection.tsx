import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';

export function ActivityMetricsSection() {
    const { register, formState: { errors } } = useFormContext<EngagementSchema>();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activity Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="login_frequency">Logins per Week</Label>
                    <Input
                        id="login_frequency"
                        type="number"
                        min={0}
                        {...register('login_frequency', { valueAsNumber: true })}
                    />
                    {errors.login_frequency && <p className="text-sm text-destructive">{errors.login_frequency.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="session_duration">Avg Session (minutes)</Label>
                    <Input
                        id="session_duration"
                        type="number"
                        min={0}
                        {...register('session_duration', { valueAsNumber: true })}
                    />
                    {errors.session_duration && <p className="text-sm text-destructive">{errors.session_duration.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="page_views">Avg Page Views</Label>
                    <Input
                        id="page_views"
                        type="number"
                        min={0}
                        {...register('page_views', { valueAsNumber: true })}
                    />
                    {errors.page_views && <p className="text-sm text-destructive">{errors.page_views.message}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
