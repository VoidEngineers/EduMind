/**
 * Engagement Form Schema
 * Zod validation schema for form data
 *
 * Note: The types are centralized in core/types.ts
 * This file only contains the Zod schema definition
 */

import { z } from 'zod';

export const engagementSchema = z.object({
    student_id: z.string().min(1, 'Student ID is required'),

    // Activity Metrics
    login_frequency: z.number().min(0, 'Must be positive'),
    session_duration: z.number().min(0, 'Must be positive'),
    page_views: z.number().min(0, 'Must be positive'),

    // Academic Engagement
    assignments_completed: z.number().min(0).max(100, 'Percentage cannot exceed 100'),
    assignments_on_time: z.number().min(0).max(100, 'Percentage cannot exceed 100'),
    quiz_attempts: z.number().min(1, 'Must be at least 1'),
    quiz_scores: z.number().min(0).max(100, 'Percentage cannot exceed 100'),

    // Social Engagement
    forum_posts: z.number().min(0),
    forum_replies: z.number().min(0),
    group_participation: z.number().min(1).max(5),

    // Content Interaction
    video_completion_rate: z.number().min(0).max(100),
    resource_downloads: z.number().min(0),
    time_on_task: z.number().min(0),
});

// Export inferred type for use in other modules
export type EngagementSchema = z.infer<typeof engagementSchema>;
