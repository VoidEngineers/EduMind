import { STYLE_NAMES } from '../constants';
import type { LearningStyleType } from '../types';
import type { StruggleTopicData } from '../../data/interfaces';

const ORDERED_STYLES: LearningStyleType[] = ['visual', 'auditory', 'reading', 'kinesthetic'];

export function buildDistributionChartData(styleDistribution: Record<LearningStyleType, number>) {
    return {
        labels: ORDERED_STYLES.map((style) => STYLE_NAMES[style]),
        datasets: [
            {
                data: ORDERED_STYLES.map((style) => styleDistribution[style]),
                backgroundColor: ['#2563eb', '#0ea5e9', '#14b8a6', '#22c55e'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };
}

export const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
    },
};

export function buildStruggleChartData(topStruggleTopics: StruggleTopicData[]) {
    return {
        labels: topStruggleTopics.map((topic) => topic.label),
        datasets: [
            {
                label: 'Occurrences',
                data: topStruggleTopics.map((topic) => topic.count),
                backgroundColor: '#2563eb',
                borderRadius: 6,
            },
        ],
    };
}

export const struggleChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                precision: 0,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
};
