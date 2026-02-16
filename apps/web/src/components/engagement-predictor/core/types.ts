/**
 * Core Domain Types
 * Single source of truth for all engagement predictor types
 */

// Import and re-export domain types from the global store
import type {
    EngagementFilters as _EngagementFilters,
    EngagementFormData as _EngagementFormData,
    EngagementLevel as _EngagementLevel,
    EngagementResult as _EngagementResult,
    InterventionItem as _InterventionItem,
} from '@/store/engagement';

export type EngagementFilters = _EngagementFilters;
export type EngagementFormData = _EngagementFormData;
export type EngagementLevel = _EngagementLevel;
export type EngagementResult = _EngagementResult;
export type InterventionItem = _InterventionItem;

// Zod schema type (inferred from schema)
export type { EngagementSchema } from '../schema';

/**
 * UI-specific types (not in store)
 */
export interface FormSectionProps {
    disabled?: boolean;
}

export interface EngagementPredictorProps {
    onComplete?: (result: EngagementResult) => void;
    initialData?: Partial<EngagementFormData>;
}

// Legacy - keeping for backward compatibility during migration
export interface SectionProps {
    formData: EngagementFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSliderChange: (name: string, value: number[]) => void;
}
