import { Doughnut } from 'react-chartjs-2';
import type { RiskGaugeProps } from './types';

export function RiskGauge({ riskScore, riskLevel, theme }: RiskGaugeProps) {
    const getRiskColorFromLevel = (level: string) => {
        const levelLower = level.toLowerCase();
        if (levelLower.includes('safe')) return '#43e97b';
        if (levelLower.includes('medium')) return '#fbbf24';
        return '#f5576c';
    };

    return (
        <div className="risk-score-section">
            <div className="risk-gauge">
                <Doughnut
                    data={{
                        labels: ['Risk Score', 'Safe Zone'],
                        datasets: [{
                            data: [riskScore * 100, 100 - riskScore * 100],
                            backgroundColor: [
                                getRiskColorFromLevel(riskLevel),
                                theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)',
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
                    aria-label={`Risk gauge showing ${(riskScore * 100).toFixed(0)} percent risk score`}
                />
                <div className="risk-gauge-overlay">
                    <div className="risk-gauge-value">
                        {(riskScore * 100).toFixed(0)}%
                    </div>
                    <div className="risk-gauge-label">Risk Score</div>
                </div>
            </div>
        </div>
    );
}