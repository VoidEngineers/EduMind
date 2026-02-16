import type { RiskPredictionResponse } from '../core/services/xaiService';

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'standard';
    category: 'academic' | 'engagement' | 'time-management' | 'support';
    isCompleted: boolean;
    isCustom?: boolean;
}

/**
 * Generates a dynamic action plan based on prediction data
 * Uses API recommendations and risk factors for personalization
 * Preserves completion state from existing plan
 */
export function generateDynamicActionPlan(
    prediction: RiskPredictionResponse,
    existingPlan: ActionItem[] = []
): ActionItem[] {
    const actions: ActionItem[] = [];
    const addedTitles = new Set<string>(); // Track titles to prevent duplicates
    let idCounter = 1;

    // Helper to check if action already exists and get its completion status
    const getExistingCompletion = (title: string): boolean => {
        const existing = existingPlan.find(item => item.title === title);
        return existing?.isCompleted || false;
    };

    // Helper to add action only if not duplicate
    const addAction = (action: Omit<ActionItem, 'id'>) => {
        if (!addedTitles.has(action.title)) {
            addedTitles.add(action.title);
            actions.push({
                id: `action-${idCounter++}`,
                ...action,
            });
            console.log('[generateDynamicActionPlan] Added:', action.title);
        } else {
            console.log('[generateDynamicActionPlan] Skipped duplicate:', action.title);
        }
    };

    // Helper to get priority based on risk level and recommendation position
    const getPriorityForRecommendation = (index: number, riskLevel: string): ActionItem['priority'] => {
        if (riskLevel === 'Safe') {
            // Safe students: lower priorities for growth opportunities
            return index === 0 ? 'medium' : 'standard';
        } else if (riskLevel === 'Medium Risk') {
            // Medium risk: mix of high and medium priorities
            return index === 0 ? 'high' : index === 1 ? 'medium' : 'standard';
        } else {
            // At-risk students: critical priorities
            return index === 0 ? 'critical' : index === 1 ? 'high' : 'medium';
        }
    };

    // 1. Add API recommendations as primary actions
    if (prediction.recommendations && prediction.recommendations.length > 0) {
        prediction.recommendations.forEach((rec: string, index: number) => {
            const title = rec;
            addAction({
                title,
                description: `Recommendation based on your risk profile`,
                priority: getPriorityForRecommendation(index, prediction.risk_level),
                category: categorizeRecommendation(rec),
                isCompleted: getExistingCompletion(title),
            });
        });
    }

    // 2. Add risk-factor-specific interventions
    const topFactors = prediction.top_risk_factors.slice(0, 3); // Top 3 risk factors
    topFactors.forEach((factor) => {
        const intervention = getRiskFactorIntervention(factor.feature, factor.value);
        if (intervention) {
            addAction({
                ...intervention,
                isCompleted: getExistingCompletion(intervention.title),
            });
        }
    });

    console.log('[generateDynamicActionPlan] Total actions generated:', actions.length);
    return actions;
}

/**
 * Categorize a recommendation string into an action category
 */
function categorizeRecommendation(recommendation: string): ActionItem['category'] {
    const lower = recommendation.toLowerCase();

    if (lower.includes('tutor') || lower.includes('advisor') || lower.includes('counseling') || lower.includes('support')) {
        return 'support';
    }
    if (lower.includes('attend') || lower.includes('participate') || lower.includes('engage') || lower.includes('study group')) {
        return 'engagement';
    }
    if (lower.includes('schedule') || lower.includes('time') || lower.includes('deadline') || lower.includes('plan')) {
        return 'time-management';
    }
    return 'academic';
}

/**
 * Get specific intervention for a risk factor
 */
function getRiskFactorIntervention(factorName: string, impact: number): Omit<ActionItem, 'id' | 'isCompleted'> | null {
    const factorLower = factorName.toLowerCase();
    const isHighImpact = impact > 0.5;

    // Grade-related factors
    if (factorLower.includes('grade') || factorLower.includes('avg_grade')) {
        return {
            title: 'Improve Grade Performance',
            description: `Your ${factorName} is a significant risk factor. Schedule weekly tutoring sessions and focus on core concepts.`,
            priority: isHighImpact ? 'critical' : 'high',
            category: 'academic',
        };
    }

    if (factorLower.includes('consistency')) {
        return {
            title: 'Build Grade Consistency',
            description: 'Create a structured study schedule and review materials regularly to avoid performance fluctuations.',
            priority: isHighImpact ? 'high' : 'medium',
            category: 'time-management',
        };
    }

    // Assessment-related
    if (factorLower.includes('assessment') || factorLower.includes('completion')) {
        return {
            title: 'Complete All Assessments',
            description: 'Prioritize completing all assignments on time. Use a task tracker to avoid missing deadlines.',
            priority: 'critical',
            category: 'academic',
        };
    }

    // Engagement-related
    if (factorLower.includes('engagement') || factorLower.includes('low_engagement')) {
        return {
            title: 'Increase Class Engagement',
            description: 'Attend all classes, participate actively in discussions, and join study groups to improve engagement.',
            priority: isHighImpact ? 'critical' : 'high',
            category: 'engagement',
        };
    }

    // Performance flags
    if (factorLower.includes('low_performance')) {
        return {
            title: 'Address Performance Issues',
            description: 'Meet with your academic advisor immediately to create a recovery plan and access support resources.',
            priority: 'critical',
            category: 'support',
        };
    }

    // Previous attempts
    if (factorLower.includes('prev_attempts') || factorLower.includes('previous_attempts')) {
        return {
            title: 'Learn from Past Attempts',
            description: 'Review what went wrong previously and implement new study strategies. Consider changing your approach.',
            priority: 'high',
            category: 'academic',
        };
    }

    // Credits
    if (factorLower.includes('credit')) {
        return {
            title: 'Manage Course Load',
            description: 'Review your course load with an advisor. Consider reducing credits if overwhelmed or adding support courses.',
            priority: 'medium',
            category: 'support',
        };
    }

    return null;
}
