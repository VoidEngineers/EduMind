import { z } from 'zod';

export const learningStyleSchema = z.object({
    student_id: z.string().min(1, 'Student ID is required'),

    // Learning Preferences (1-5 sliders)
    prefers_diagrams: z.number().min(1).max(5),
    prefers_lectures: z.number().min(1).max(5),
    prefers_reading: z.number().min(1).max(5),
    prefers_hands_on: z.number().min(1).max(5),

    // Study Habits (Enums)
    note_taking_style: z.enum(['visual', 'written', 'audio', 'mixed']),
    study_environment: z.enum(['quiet', 'music', 'group', 'varies']),
    retention_method: z.enum(['seeing', 'hearing', 'doing', 'reading']),

    // Time Metrics (number inputs)
    video_watch_time: z.number().min(0, 'Must be positive'),
    reading_time: z.number().min(0, 'Must be positive'),
    interactive_time: z.number().min(0, 'Must be positive'),
});

export type LearningStyleSchema = z.infer<typeof learningStyleSchema>;
