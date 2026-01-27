import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CustomizeModalForm } from './CustomizeModalForm';
import type { CustomizeModalProps } from './types';

export function CustomizeModal({
    show,
    newActionItem,
    onClose,
    onTitleChange,
    onDescriptionChange,
    onPriorityChange,
    onCategoryChange,
    onAdd
}: CustomizeModalProps) {
    return (
        <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="border-b pb-4 mb-4">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        Add Custom Action
                    </DialogTitle>
                </DialogHeader>

                <CustomizeModalForm
                    newActionItem={newActionItem}
                    onTitleChange={onTitleChange}
                    onDescriptionChange={onDescriptionChange}
                    onPriorityChange={onPriorityChange}
                    onCategoryChange={onCategoryChange}
                />

                <DialogFooter className="gap-3 sm:gap-0 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} className="bg-background text-foreground border-input hover:bg-muted">
                        Cancel
                    </Button>
                    <Button
                        onClick={onAdd}
                        className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                    >
                        Add Action
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
