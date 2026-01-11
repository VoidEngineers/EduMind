import { Bar } from "react-chartjs-2";
import type { RiskFactorsChartProps } from "./types";

export function RiskFactorsChart({ factors, theme }: RiskFactorsChartProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'academic': return '#667eea';
            case 'engagement': return '#f59e0b';
            case 'behavioral': return '#ef4444';
            default: return '#6b7280';
        }
    };
    const sortedFactors = [...factors].sort((a, b) => b.impact - a.impact);
    const chartData = {
        labels: sortedFactors.map(f => f.name),
        datasets: [{
            label: 'Risk Impact',
            data: sortedFactors.map(f => f.impact),
            backgroundColor: sortedFactors.map(f => getCategoryColor(f.category)),
            borderRadius: 8,
        }],
    };
    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Impact: ${context.parsed.x}%`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                ticks: {
                    color: theme === 'dark' ? '#a0aec0' : '#4a5568',
                },
            },
            y: {
                grid: { display: false },
                ticks: {
                    color: theme === 'dark' ? '#a0aec0' : '#4a5568',
                },
            },
        },
    };
    return (
        <div className="risk-factors-chart">
            <h3>Risk Factor Breakdown</h3>
            <div className="chart-container" style={{ height: '300px' }}>
                <Bar data={chartData} options={options} />
            </div>
            <div className="chart-legend">
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#667eea' }}></span>
                    Academic
                </span>
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
                    Engagement
                </span>
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#ef4444' }}></span>
                    Behavioral
                </span>
            </div>
        </div>
    );
}