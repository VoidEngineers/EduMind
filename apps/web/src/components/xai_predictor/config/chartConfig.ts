/**
 * Chart.js Configuration
 * Centralizes Chart.js component registration
 * Should be called once at app initialization
 */

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip
} from 'chart.js';

/**
 * Registers all Chart.js components needed for the application
 * Call this once in main.tsx before rendering the app
 */
export function registerChartComponents(): void {
    Chart.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        PointElement,
        LineElement,
        RadialLinearScale
    );
}
