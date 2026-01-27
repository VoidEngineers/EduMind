import type { EngagementFormData } from '@/store/engagementStore';

export interface SectionProps {
    formData: EngagementFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSliderChange: (name: string, value: number[]) => void;
}
