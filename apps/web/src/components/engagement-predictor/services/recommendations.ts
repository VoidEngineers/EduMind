import type { EngagementLevel } from '@/store/engagementStore';

export function generateRecommendations(level: EngagementLevel, riskFactors: string[]): string[] {
    const recs: string[] = [];

    if (riskFactors.includes('Low assignment completion rate')) {
        recs.push('Set up assignment reminders and break tasks into smaller chunks');
    }
    if (riskFactors.includes('Infrequent logins')) {
        recs.push('Schedule regular study sessions and use mobile app for quick access');
    }
    if (riskFactors.includes('Limited forum participation')) {
        recs.push('Start with responding to existing threads before creating new posts');
    }
    if (riskFactors.includes('Low video engagement')) {
        recs.push('Try watching videos at 1.25x speed and take notes to stay focused');
    }
    if (riskFactors.includes('Short session durations')) {
        recs.push('Use the Pomodoro technique: 25 minutes focus, 5 minutes break');
    }

    if (level === 'highly_engaged') {
        recs.push('Consider becoming a peer tutor or study group leader');
    } else if (level === 'disengaged') {
        recs.push('Schedule a meeting with academic advisor to discuss goals');
    }

    return recs.slice(0, 5);
}
