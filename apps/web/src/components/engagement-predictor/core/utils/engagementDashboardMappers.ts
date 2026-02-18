import type {
    BackendScheduleResponse,
    QuickStudent,
    StudentListItem,
    SystemStatus,
} from '../types/dashboard';

export function normalizeSystemStatus(status: string | undefined): SystemStatus {
    const normalized = (status || '').toLowerCase();

    if (normalized === 'healthy') return 'healthy';
    if (normalized === 'degraded') return 'degraded';
    if (normalized === 'down' || normalized === 'unhealthy') return 'down';

    return 'degraded';
}

export function deriveQuickStudents(students: StudentListItem[], avgScore: number): QuickStudent[] {
    if (students.length === 0) return [];

    const sortedByScore = [...students].sort((a, b) => a.engagement_score - b.engagement_score);
    const highPerformer = sortedByScore[sortedByScore.length - 1];
    const atRisk = sortedByScore.find((student) => student.risk_level === 'High' || student.at_risk) || sortedByScore[0];

    const average = [...students].sort(
        (a, b) => Math.abs(a.engagement_score - avgScore) - Math.abs(b.engagement_score - avgScore)
    )[0];

    const quickStudents: QuickStudent[] = [];
    const seen = new Set<string>();

    const pushUnique = (label: string, student: StudentListItem | undefined) => {
        if (!student || seen.has(student.student_id)) return;
        seen.add(student.student_id);
        quickStudents.push({ id: student.student_id, label });
    };

    pushUnique('High Performer', highPerformer);
    pushUnique('Average', average);
    pushUnique('At Risk', atRisk);

    return quickStudents;
}

export function mapScheduleFocus(
    taskBreakdown: BackendScheduleResponse['daily_schedules'][number]['task_breakdown']
): string {
    if (!taskBreakdown) return 'General Study';

    const focusWeights: Array<[string, number]> = [
        ['Assignment Prep', taskBreakdown.assignment_prep_minutes || 0],
        ['Quiz Practice', taskBreakdown.quiz_interaction_minutes || 0],
        ['Forum Engagement', taskBreakdown.forum_engagement_minutes || 0],
        ['General Study', taskBreakdown.general_study_minutes || 0],
    ];

    const highest = focusWeights.sort((a, b) => b[1] - a[1])[0];

    return highest?.[0] || 'General Study';
}

export function extractPredictionFactors(payload: Record<string, unknown> | null | undefined): string[] {
    return Object.entries(payload || {})
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key.replaceAll('_', ' '));
}
