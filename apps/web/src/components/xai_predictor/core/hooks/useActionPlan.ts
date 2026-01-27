import { useCallback, useEffect, useState } from 'react';

interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'standard';
    category: 'academic' | 'engagement' | 'time-management' | 'support';
    isCompleted: boolean;
    isCustom?: boolean;
}

const STORAGE_KEY = 'xai_action_plan';

/**
 * Custom hook for managing action plan
 * Generates action plan based on risk level and persists completion state
 */
export function useActionPlan(riskLevel?: string) {
    const [actionPlan, setActionPlan] = useState<ActionItem[]>([]);

    // Generate action plan based on risk level
    const generateActionPlan = useCallback((level: string): ActionItem[] => {
        if (level === 'Safe') {
            return [
                { id: '1', title: 'Maintain Excellence', description: 'Continue your current study habits and maintain consistent performance across all modules', priority: 'standard', category: 'academic', isCompleted: false },
                { id: '2', title: 'Peer Mentoring', description: 'Share your success strategies with struggling peers through study groups or tutoring', priority: 'medium', category: 'engagement', isCompleted: false },
                { id: '3', title: 'Advanced Challenges', description: 'Explore additional learning materials, research papers, and advanced topics in your field', priority: 'standard', category: 'academic', isCompleted: false },
                { id: '4', title: 'Leadership Opportunities', description: 'Take on leadership roles in group projects, class presentations, and student organizations', priority: 'medium', category: 'engagement', isCompleted: false },
                { id: '5', title: 'Aim for Distinction', description: 'Set goals to achieve distinction-level grades (80%+) in all remaining modules', priority: 'high', category: 'academic', isCompleted: false },
                { id: '6', title: 'Build Your Portfolio', description: 'Work on side projects, research, or internships to enhance your academic portfolio', priority: 'medium', category: 'engagement', isCompleted: false }
            ];
        } else if (level === 'Medium Risk') {
            return [
                { id: '1', title: 'Weekly Academic Check-ins', description: 'Schedule weekly meetings with your tutor to review progress and address concerns immediately', priority: 'high', category: 'support', isCompleted: false },
                { id: '2', title: 'Structured Study Schedule', description: 'Create and follow a daily study timetable with specific goals for each 2-hour session', priority: 'high', category: 'time-management', isCompleted: false },
                { id: '3', title: 'Join Study Groups', description: 'Participate in peer study groups 2-3 times per week for collaborative learning and support', priority: 'medium', category: 'engagement', isCompleted: false },
                { id: '4', title: 'Complete All Assessments', description: 'Prioritize completing all assignments on time, even if perfection isn\'t possible initially', priority: 'critical', category: 'academic', isCompleted: false },
                { id: '5', title: 'Improve Weak Areas', description: 'Identify subjects where you scored below 60% and dedicate 3+ hours weekly to improvement', priority: 'high', category: 'academic', isCompleted: false },
                { id: '6', title: 'Use Learning Resources', description: 'Access library resources, online tutorials, academic workshops, and supplementary materials', priority: 'medium', category: 'academic', isCompleted: false },
                { id: '7', title: 'Active Class Participation', description: 'Attend all classes, ask questions, and engage actively with course materials and discussions', priority: 'high', category: 'engagement', isCompleted: false }
            ];
        } else {
            return [
                { id: '1', title: 'URGENT: Emergency Academic Advisor Meeting', description: 'Schedule immediate meeting with academic advisor to create a comprehensive intervention plan', priority: 'critical', category: 'support', isCompleted: false },
                { id: '2', title: 'Intensive Tutoring Sessions', description: 'Attend mandatory tutoring sessions 3-4 times per week for all struggling subjects', priority: 'critical', category: 'support', isCompleted: false },
                { id: '3', title: 'Daily Study Commitment', description: 'Dedicate minimum 3-4 hours daily to focused study with regular 10-minute breaks', priority: 'critical', category: 'time-management', isCompleted: false },
                { id: '4', title: 'Complete Overdue Work', description: 'Immediately prioritize and complete all missing or late assignments - negotiate extensions if needed', priority: 'critical', category: 'academic', isCompleted: false },
                { id: '5', title: 'Attend All Classes', description: 'Ensure 100% attendance in all lectures, labs, tutorials, and mandatory sessions', priority: 'critical', category: 'engagement', isCompleted: false },
                { id: '6', title: 'Academic Skills Workshop', description: 'Enroll in academic skills workshops for time management, study techniques, exam preparation', priority: 'high', category: 'support', isCompleted: false },
                { id: '7', title: 'Weekly Progress Reports', description: 'Submit weekly progress reports to your academic advisor showing all completed work and improvements', priority: 'high', category: 'academic', isCompleted: false },
                { id: '8', title: 'Seek Counseling Support', description: 'If personal issues are affecting studies, schedule counseling sessions immediately', priority: 'medium', category: 'support', isCompleted: false },
                { id: '9', title: 'Create Recovery Plan', description: 'Work with advisor to create detailed recovery plan with specific grades needed to pass', priority: 'critical', category: 'academic', isCompleted: false }
            ];
        }
    }, []);

    // Load saved completion state from localStorage
    useEffect(() => {
        if (riskLevel) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const savedPlan = JSON.parse(saved);
                    setActionPlan(savedPlan);
                } catch {
                    // If parsing fails, generate new plan
                    setActionPlan(generateActionPlan(riskLevel));
                }
            } else {
                setActionPlan(generateActionPlan(riskLevel));
            }
        }
    }, [riskLevel, generateActionPlan]);

    // Save to localStorage whenever action plan changes
    useEffect(() => {
        if (actionPlan.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(actionPlan));
        }
    }, [actionPlan]);

    const toggleComplete = useCallback((id: string) => {
        setActionPlan(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            )
        );
    }, []);

    const addAction = useCallback((action: Omit<ActionItem, 'id' | 'isCompleted'>) => {
        const newAction: ActionItem = {
            ...action,
            id: Date.now().toString(),
            isCompleted: false,
            isCustom: true,
        };
        setActionPlan(prev => [...prev, newAction]);
    }, []);

    const removeAction = useCallback((id: string) => {
        setActionPlan(prev => prev.filter(item => item.id !== id));
    }, []);

    const getProgress = useCallback(() => {
        if (actionPlan.length === 0) return 0;
        return Math.round((actionPlan.filter(a => a.isCompleted).length / actionPlan.length) * 100);
    }, [actionPlan]);

    const clearPlan = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setActionPlan([]);
    }, []);

    return {
        actionPlan,
        toggleComplete,
        addAction,
        removeAction,
        getProgress,
        clearPlan,
        completedCount: actionPlan.filter(a => a.isCompleted).length,
        totalCount: actionPlan.length,
    };
}
