export type CustomizeModalFormProps = {
    newActionItem: {
        title: string;
        description: string;
        priority: 'critical' | 'high' | 'medium' | 'standard';
        category: 'academic' | 'engagement' | 'time-management' | 'support';
    };
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
};

export type CustomizeModalProps = CustomizeModalFormProps & {
    show: boolean;
    onClose: () => void;
    onAdd: () => void;
};