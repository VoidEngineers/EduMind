import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Brain } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { LearningStyleType } from '../../core/types';
import type { StruggleTopicData } from '../../data/interfaces';
import {
    buildDistributionChartData,
    buildStruggleChartData,
    distributionChartOptions,
    struggleChartOptions,
} from '../../core/charts/learningStyleCharts';

interface LearningStyleAnalyticsSectionProps {
    styleDistribution: Record<LearningStyleType, number>;
    topStruggleTopics: StruggleTopicData[];
}

export function LearningStyleAnalyticsSection({
    styleDistribution,
    topStruggleTopics,
}: LearningStyleAnalyticsSectionProps) {
    const distributionChartData = useMemo(
        () => buildDistributionChartData(styleDistribution),
        [styleDistribution]
    );
    const struggleChartData = useMemo(
        () => buildStruggleChartData(topStruggleTopics),
        [topStruggleTopics]
    );

    return (
        <section className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Learning Style Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-72 w-full">
                        <Doughnut data={distributionChartData} options={distributionChartOptions} />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Top Struggle Topics
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-72 w-full">
                        <Bar data={struggleChartData} options={struggleChartOptions} />
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
