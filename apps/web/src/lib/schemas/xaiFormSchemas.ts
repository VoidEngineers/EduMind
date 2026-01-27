import { z } from 'zod';

/**
 * Form Schemas for XAI Predictor
 * Compatible with Zod v4 syntax
 */

// Student Risk Prediction Form Schema
export const studentRiskFormSchema = z.object({
    student_id: z
        .string()
        .min(1, 'Student ID is required')
        .max(50, 'Student ID must be less than 50 characters'),

    avg_grade: z
        .number({ message: 'Average grade must be a number' })
        .min(0, 'Grade must be at least 0')
        .max(100, 'Grade cannot exceed 100'),

    grade_consistency: z
        .number({ message: 'Grade consistency must be a number' })
        .min(0, 'Consistency must be at least 0')
        .max(100, 'Consistency cannot exceed 100'),

    grade_range: z
        .number({ message: 'Grade range must be a number' })
        .min(0, 'Range must be at least 0')
        .max(100, 'Range cannot exceed 100'),

    num_assessments: z
        .number({ message: 'Number of assessments must be a number' })
        .int('Must be a whole number')
        .min(0, 'Must be at least 0')
        .max(50, 'Cannot exceed 50 assessments'),

    assessment_completion_rate: z
        .number({ message: 'Completion rate must be a number' })
        .min(0, 'Rate must be at least 0')
        .max(1, 'Rate cannot exceed 1'),

    studied_credits: z
        .number({ message: 'Studied credits must be a number' })
        .min(0, 'Credits must be at least 0')
        .max(300, 'Credits cannot exceed 300'),

    num_of_prev_attempts: z
        .number({ message: 'Previous attempts must be a number' })
        .int('Must be a whole number')
        .min(0, 'Must be at least 0')
        .max(10, 'Cannot exceed 10 attempts'),

    low_performance: z
        .number({ message: 'Low performance must be a number' })
        .int('Must be 0 or 1')
        .min(0)
        .max(1),

    low_engagement: z
        .number({ message: 'Low engagement must be a number' })
        .int('Must be 0 or 1')
        .min(0)
        .max(1),

    has_previous_attempts: z
        .number({ message: 'Previous attempts indicator must be a number' })
        .int('Must be 0 or 1')
        .min(0)
        .max(1),
});

// Custom Action Form Schema
export const customActionFormSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),

    description: z
        .string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters'),

    priority: z.enum(['critical', 'high', 'medium', 'standard'], {
        message: 'Please select a valid priority level',
    }),

    category: z.enum(['academic', 'engagement', 'time-management', 'support'], {
        message: 'Please select a valid category',
    }),
});

// What-If Scenario Form Schema
export const whatIfScenarioFormSchema = z.object({
    avg_grade: z
        .number()
        .min(0, 'Grade must be at least 0')
        .max(100, 'Grade cannot exceed 100'),

    grade_consistency: z
        .number()
        .min(0, 'Consistency must be at least 0')
        .max(100, 'Consistency cannot exceed 100'),

    assessment_completion_rate: z
        .number()
        .min(0, 'Rate must be at least 0')
        .max(1, 'Rate cannot exceed 1'),

    low_engagement: z
        .number()
        .int()
        .min(0)
        .max(1),
});

// Type inference
export type StudentRiskFormData = z.infer<typeof studentRiskFormSchema>;
export type CustomActionFormData = z.infer<typeof customActionFormSchema>;
export type WhatIfScenarioFormData = z.infer<typeof whatIfScenarioFormSchema>;
