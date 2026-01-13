import { Doughnut } from 'react-chartjs-2';
import type { RiskGaugeProps } from './types';

// Removed 'theme' from props as it is no longer used (forced light mode)
export function RiskGauge({ riskScore, riskLevel, probabilities }: Omit<RiskGaugeProps, 'theme'> & { probabilities?: Record<string, number> }) {
    // Determine what to display based on risk level
    const riskLevelLower = riskLevel.toLowerCase();

    let displayValue: number;
    let displayLabel: string;

    // Check for exact matches first
    if (riskLevelLower.includes('safe') && probabilities?.Safe !== undefined) {
        // For safe students, show probability of being safe
        displayValue = Math.round(probabilities.Safe * 100);
        displayLabel = 'Safety Score';
    } else if (riskLevelLower.includes('medium') && probabilities?.['Medium Risk'] !== undefined) {
        // For medium risk students, show probability of medium risk
        displayValue = Math.round(probabilities['Medium Risk'] * 100);
        displayLabel = 'Risk Score';
    } else if (riskLevelLower.includes('at-risk') && probabilities?.['At-Risk'] !== undefined) {
        // For at-risk students, show probability of being at risk
        displayValue = Math.round(probabilities['At-Risk'] * 100);
        displayLabel = 'Risk Score';
    } else {
        // Fallback to risk_score (0-1 scale)
        displayValue = Math.round(riskScore * 100);
        displayLabel = 'Risk Score';
    }

    // Debug logging
    console.log('RiskGauge - riskLevel:', riskLevel);
    console.log('RiskGauge - Raw riskScore:', riskScore);
    console.log('RiskGauge - probabilities:', probabilities);
    console.log('RiskGauge - Display value:', displayValue);
    console.log('RiskGauge - Display label:', displayLabel);

    const getRiskColorFromLevel = (level: string) => {
        const keyLower = level.toLowerCase();
        if (keyLower.includes('safe')) return '#22c55e';
        if (keyLower.includes('medium')) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 border-b">
            <div className="relative w-80 h-80">
                <Doughnut
                    data={{
                        labels: [displayLabel, riskLevelLower.includes('safe') ? 'Risk Zone' : 'Safe Zone'],
                        datasets: [{
                            data: [displayValue, 100 - displayValue],
                            backgroundColor: [
                                getRiskColorFromLevel(riskLevel),
                                '#e2e8f0', // Slate-200 solid hex for track
                            ],
                            borderWidth: 0,
                        }],
                    }}
                    options={{
                        cutout: '75%',
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                        },
                    }}
                    aria-label={`${displayLabel} showing ${displayValue} percent`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <div
                        className="text-6xl font-black text-foreground drop-shadow-lg"
                        style={{
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            color: 'hsl(var(--foreground))'
                        }}
                    >
                        {displayValue}%
                    </div>
                </div>
            </div>
            {/* Fallback text display below chart */}
            <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                    {displayLabel}: <span className="font-bold text-foreground">{displayValue}%</span>
                </p>
            </div>
        </div>
    );
}