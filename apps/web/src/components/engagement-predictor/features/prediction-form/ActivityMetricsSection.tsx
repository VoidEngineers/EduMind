import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import type { SectionProps } from '../../core/types';

export function ActivityMetricsSection({ formData, onInputChange }: Omit<SectionProps, 'onSliderChange'>) {
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
                        name="login_frequency"
                        type="number"
                        value={formData.login_frequency}
                        onChange={onInputChange}
                        min={0}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="session_duration">Avg Session (minutes)</Label>
                    <Input
                        id="session_duration"
                        name="session_duration"
                        type="number"
                        value={formData.session_duration}
                        onChange={onInputChange}
                        min={0}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="page_views">Avg Page Views</Label>
                    <Input
                        id="page_views"
                        name="page_views"
                        type="number"
                        value={formData.page_views}
                        onChange={onInputChange}
                        min={0}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
