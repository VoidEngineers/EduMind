/**
 * Core Constants for Learning Style Predictor
 * Shared constants across the module
 */

import { BookOpen, Eye, Hand, Headphones } from 'lucide-react';
import type { LearningStyleFormData, LearningStyleType } from './types';

/**
 * Icons for each learning style
 */
export const STYLE_ICONS = {
    visual: Eye,
    auditory: Headphones,
    reading: BookOpen,
    kinesthetic: Hand,
} as const;

/**
 * Color classes for each learning style
 */
export const STYLE_COLORS = {
    visual: 'text-blue-600 bg-blue-100',
    auditory: 'text-purple-600 bg-purple-100',
    reading: 'text-green-600 bg-green-100',
    kinesthetic: 'text-orange-600 bg-orange-100',
} as const;

/**
 * Initial form data values
 */
export const INITIAL_FORM_DATA: LearningStyleFormData = {
    student_id: '',
    prefers_diagrams: 3,
    prefers_lectures: 3,
    prefers_reading: 3,
    prefers_hands_on: 3,
    note_taking_style: 'mixed',
    study_environment: 'varies',
    retention_method: 'seeing',
    video_watch_time: 30,
    reading_time: 30,
    interactive_time: 30,
};

/**
 * Form field configurations for preferences
 */
export const PREFERENCE_FIELDS = [
    { name: 'prefers_diagrams', label: 'Diagrams & Visual Aids', icon: Eye },
    { name: 'prefers_lectures', label: 'Lectures & Audio', icon: Headphones },
    { name: 'prefers_reading', label: 'Reading & Text', icon: BookOpen },
    { name: 'prefers_hands_on', label: 'Hands-on Activities', icon: Hand },
] as const;

/**
 * Style display names
 */
export const STYLE_NAMES: Record<LearningStyleType, string> = {
    visual: 'Visual',
    auditory: 'Auditory',
    reading: 'Reading/Writing',
    kinesthetic: 'Kinesthetic',
};

/**
 * Style descriptions
 */
export const STYLE_DESCRIPTIONS: Record<LearningStyleType, string> = {
    visual: 'Learn best through seeing and visualizing',
    auditory: 'Learn best through listening and discussing',
    reading: 'Learn best through reading and writing',
    kinesthetic: 'Learn best through hands-on experience',
};
