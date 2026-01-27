import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageSquare } from 'lucide-react';
import type { SectionProps } from '../../core/types';

export function SocialEngagementSection({ formData, onInputChange, onSliderChange }: SectionProps) {
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
                        name="forum_posts"
                        type="number"
                        value={formData.forum_posts}
                        onChange={onInputChange}
                        min={0}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="forum_replies">Forum Replies/Week</Label>
                    <Input
                        id="forum_replies"
                        name="forum_replies"
                        type="number"
                        value={formData.forum_replies}
                        onChange={onInputChange}
                        min={0}
                    />
                </div>
                <div className="space-y-3">
                    <Label>Group Participation (1-5)</Label>
                    <Slider
                        value={[formData.group_participation]}
                        onValueChange={(v) => onSliderChange('group_participation', v)}
                        min={1}
                        max={5}
                        step={1}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
