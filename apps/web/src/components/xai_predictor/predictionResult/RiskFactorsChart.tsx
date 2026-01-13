import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import type { RiskFactorsChartProps } from "./types";

export function RiskFactorsChart({ factors }: RiskFactorsChartProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'academic': return '#60a5fa'; // blue-400 (softer)
            case 'engagement': return '#c084fc'; // purple-400 (softer)
            case 'behavioral': return '#f87171'; // red-400 (softer)
            default: return '#94a3b8'; // slate-400
        }
    };
    const sortedFactors = [...(factors || [])].sort((a, b) => b.impact - a.impact);
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
                    color: 'rgba(156, 163, 175, 0.2)', // slate-400 with opacity
                },
                ticks: {
                    color: 'hsl(var(--muted-foreground))',
                },
            },
            y: {
                grid: { display: false },
                ticks: {
                    color: 'hsl(var(--muted-foreground))',
                },
            },
        },
    };

    return (
        <Card className="shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                    Risk Factor Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mb-6">
                    <Bar data={chartData} options={options} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center text-sm font-medium border-t pt-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Academic
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        Engagement
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        Behavioral
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}