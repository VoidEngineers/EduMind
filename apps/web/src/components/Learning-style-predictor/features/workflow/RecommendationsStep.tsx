import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MAX_RECOMMENDATIONS, MIN_RECOMMENDATIONS } from '../../core/constants/uiConfig';

interface RecommendationsStepProps {
    topicFilter: string;
    maxRecommendations: number;
    filteredRecommendations: string[];
    onTopicFilterChange: (value: string) => void;
    onMaxRecommendationsChange: (value: number) => void;
}

export function RecommendationsStep({
    topicFilter,
    maxRecommendations,
    filteredRecommendations,
    onTopicFilterChange,
    onMaxRecommendationsChange,
}: RecommendationsStepProps) {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="pb-4 border-b">
                <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Step 3</div>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Filter and review recommendations generated from the predicted style profile.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="topicFilter">Topic (Optional)</Label>
                        <Input
                            id="topicFilter"
                            value={topicFilter}
                            onChange={(event) => onTopicFilterChange(event.target.value)}
                            placeholder="e.g., Python Loops, Data Structures"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Number of Recommendations: {maxRecommendations}</Label>
                        <Slider
                            value={[maxRecommendations]}
                            onValueChange={(value) => onMaxRecommendationsChange(value[0] ?? maxRecommendations)}
                            min={MIN_RECOMMENDATIONS}
                            max={MAX_RECOMMENDATIONS}
                            step={1}
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    {filteredRecommendations.length > 0 ? filteredRecommendations.map((recommendation, index) => (
                        <div key={`${recommendation}-${index}`} className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-sm text-foreground">
                                <span className="mr-2 font-semibold text-primary">{index + 1}.</span>
                                {recommendation}
                            </p>
                        </div>
                    )) : (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
                            No recommendations matched the selected topic filter.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
