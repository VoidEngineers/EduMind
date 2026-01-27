import type { EngagementFormData, EngagementLevel, EngagementResult } from '@/store/engagementStore';
import { generateRecommendations } from './recommendations';

/**
 * Calculate engagement level based on form data
 */
export function calculateEngagement(data: EngagementFormData): EngagementResult {
    // Calculate sub-scores
    const academicScore = (
        data.assignments_completed * 0.3 +
        data.assignments_on_time * 0.3 +
        data.quiz_scores * 0.4
    );

    const socialScore = (
        Math.min(100, data.forum_posts * 10) * 0.3 +
        Math.min(100, data.forum_replies * 5) * 0.3 +
        data.group_participation * 20 * 0.4
    );

    const behavioralScore = (
        Math.min(100, data.login_frequency * 10) * 0.4 +
        Math.min(100, data.session_duration * 2) * 0.3 +
        Math.min(100, data.page_views * 5) * 0.3
    );

    const contentScore = (
        data.video_completion_rate * 0.4 +
        Math.min(100, data.resource_downloads * 10) * 0.3 +
        Math.min(100, (data.time_on_task / 60) * 10) * 0.3
    );

    // Overall engagement score (weighted average)
    const engagementScore = Math.round(
        academicScore * 0.35 +
        socialScore * 0.15 +
        behavioralScore * 0.25 +
        contentScore * 0.25
    );

    // Determine engagement level
    let engagementLevel: EngagementLevel;
    if (engagementScore >= 80) {
        engagementLevel = 'highly_engaged';
    } else if (engagementScore >= 60) {
        engagementLevel = 'engaged';
    } else if (engagementScore >= 40) {
        engagementLevel = 'at_risk';
    } else {
        engagementLevel = 'disengaged';
    }

    // Identify risk factors and strengths
    const riskFactors: string[] = [];
    const strengths: string[] = [];

    if (data.assignments_completed < 70) riskFactors.push('Low assignment completion rate');
    if (data.login_frequency < 3) riskFactors.push('Infrequent logins');
    if (data.forum_posts + data.forum_replies < 2) riskFactors.push('Limited forum participation');
    if (data.video_completion_rate < 50) riskFactors.push('Low video engagement');
    if (data.session_duration < 15) riskFactors.push('Short session durations');

    if (data.assignments_on_time >= 90) strengths.push('Excellent time management');
    if (data.quiz_scores >= 80) strengths.push('Strong academic performance');
    if (data.group_participation >= 4) strengths.push('Active group participation');
    if (data.video_completion_rate >= 80) strengths.push('High content engagement');

    // Determine trend (mock - based on current metrics)
    const trend = engagementScore >= 70 ? 'improving' : engagementScore >= 50 ? 'stable' : 'declining';

    // Generate recommendations
    const recommendations = generateRecommendations(engagementLevel, riskFactors);

    return {
        engagement_level: engagementLevel,
        engagement_score: engagementScore,
        risk_factors: riskFactors,
        strengths,
        trend,
        recommendations,
        detailed_scores: {
            academic: Math.round(academicScore),
            social: Math.round(socialScore),
            behavioral: Math.round(behavioralScore),
            content: Math.round(contentScore),
        },
        timestamp: new Date().toISOString(),
    };
}
