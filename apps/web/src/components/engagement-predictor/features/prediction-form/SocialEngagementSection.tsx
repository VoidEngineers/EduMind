import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageSquare } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';

export function SocialEngagementSection() {
    const { register, control, formState: { errors } } = useFormContext<EngagementSchema>();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Social Engagement
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="forum_posts">Forum Posts/Week</Label>
                    <Input
                        id="forum_posts"
                        type="number"
                        min={0}
                        {...register('forum_posts', { valueAsNumber: true })}
                    />
                    {errors.forum_posts && <p className="text-sm text-destructive">{errors.forum_posts.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="forum_replies">Forum Replies/Week</Label>
                    <Input
                        id="forum_replies"
                        type="number"
                        min={0}
                        {...register('forum_replies', { valueAsNumber: true })}
                    />
                    {errors.forum_replies && <p className="text-sm text-destructive">{errors.forum_replies.message}</p>}
                </div>
                <div className="space-y-3">
                    <Label>Group Participation (1-5)</Label>
                    <Controller
                        name="group_participation"
                        control={control}
                        render={({ field }) => (
                            <Slider
                                value={[field.value]}
                                onValueChange={(v) => field.onChange(v[0])}
                                min={1}
                                max={5}
                                step={1}
                            />
                        )}
                    />
                    {errors.group_participation && <p className="text-sm text-destructive">{errors.group_participation.message}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
