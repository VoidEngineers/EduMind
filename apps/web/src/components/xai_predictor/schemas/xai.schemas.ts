import { z } from 'zod';

/**
 * Zod Schema for Student Risk Request
 * Validates student data before sending to API
 */
export const StudentRiskRequestSchema = z.object({
    student_id: z.string().min(1, 'Student ID is required'),
    avg_grade: z.number().min(0).max(100),
    grade_consistency: z.number().min(0).max(100),
    grade_range: z.number().min(0).max(100),
    num_assessments: z.number().int().min(0),
    assessment_completion_rate: z.number().min(0).max(1),
    studied_credits: z.number().min(0),
    num_of_prev_attempts: z.number().int().min(0),
    low_performance: z.number().int().min(0).max(1),
    low_engagement: z.number().int().min(0).max(1),
    has_previous_attempts: z.number().int().min(0).max(1),
});


/**
 * Zod Schema for Risk Factor
 * Using preprocess to handle cases where API returns invalid values
 */
export const RiskFactorSchema = z.object({
    feature: z.string(),
    value: z.preprocess(
        (val) => {
            // Handle null, undefined, or non-numeric strings
            if (val === null || val === undefined || val === '') return 0;
            const num = Number(val);
            // If conversion results in NaN, default to 0
            return isNaN(num) ? 0 : num;
        },
        z.number()
    ),
    impact: z.string(),
});

/**
 * Zod Schema for Risk Prediction Response
 * Validates API response data and filters out invalid risk factors
 */
export const RiskPredictionResponseSchema = z.object({
    student_id: z.string(),
    risk_level: z.string(),
    risk_score: z.number().min(0).max(1),
    confidence: z.number().min(0).max(100),
    probabilities: z.object({
        Safe: z.number(),
        'Medium Risk': z.number().optional(),
        'At-Risk': z.number(),
    }),
    recommendations: z.array(z.string()),
    top_risk_factors: z.array(RiskFactorSchema).transform((factors) =>
        // Filter out any factors with value of 0 (which were NaN)
        factors.filter(f => f.value !== 0 || f.feature !== '')
    ),
    prediction_id: z.string(),
    timestamp: z.string(),
});

/**
 * Zod Schema for Health Response
 */
export const HealthResponseSchema = z.object({
    status: z.string(),
    service: z.string(),
    version: z.string(),
    model_loaded: z.boolean(),
    environment: z.string().optional(),
});

/**
 * Inferred TypeScript types from Zod schemas
 * These ensure type safety across the application
 */
export type StudentRiskRequest = z.infer<typeof StudentRiskRequestSchema>;
export type RiskFactor = z.infer<typeof RiskFactorSchema>;
export type RiskPredictionResponse = z.infer<typeof RiskPredictionResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
