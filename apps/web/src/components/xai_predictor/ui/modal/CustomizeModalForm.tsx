import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CustomizeModalFormProps } from './types';

export function CustomizeModalForm({
    newActionItem,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onCategoryChange,
}: CustomizeModalFormProps) {
    return (
        <div className="space-y-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="custom-action-title" className="font-semibold text-foreground">Action Title</Label>
                <Input
                    id="custom-action-title"
                    value={newActionItem.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTitleChange(e.target.value)}
                    placeholder="Enter action title"
                    className="bg-white border-input text-foreground font-medium"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="custom-action-description" className="font-semibold text-foreground">Description</Label>
                <Textarea
                    id="custom-action-description"
                    value={newActionItem.description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Describe the action"
                    rows={3}
                    className="resize-none bg-white border-input text-foreground font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="custom-action-priority" className="font-semibold text-foreground">Priority</Label>
                    <Select value={newActionItem.priority} onValueChange={onPriorityChange}>
                        <SelectTrigger id="custom-action-priority" className="bg-white border-input text-foreground font-medium">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border">
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="custom-action-category" className="font-semibold text-foreground">Category</Label>
                    <Select value={newActionItem.category} onValueChange={onCategoryChange}>
                        <SelectTrigger id="custom-action-category" className="bg-white border-input text-foreground font-medium">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border">
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="time-management">Time Management</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
