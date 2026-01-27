/**
 * Learning Style Predictor Component
 * Main entry point for learning style predictions
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLearningStyleStore } from '@/store/learningStyleStore';
import { BookOpen, Brain, Eye, Hand, Headphones, Lightbulb, Loader2, RotateCcw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { learningStyleService } from './services/learningStyleService';

const styleIcons = {
    visual: Eye,
    auditory: Headphones,
    reading: BookOpen,
    kinesthetic: Hand,
};

const styleColors = {
    visual: 'text-blue-600 bg-blue-100',
    auditory: 'text-purple-600 bg-purple-100',
    reading: 'text-green-600 bg-green-100',
    kinesthetic: 'text-orange-600 bg-orange-100',
};

export function LearningStylePredictor() {
    const store = useLearningStyleStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        store.updateFormData({
            [name]: type === 'number' ? parseFloat(value) : value,
        });
    }, [store]);

    const handleSliderChange = useCallback((name: string, value: number[]) => {
        store.updateFormData({ [name]: value[0] });
    }, [store]);

    const handleSelectChange = useCallback((name: string, value: string) => {
        store.updateFormData({ [name]: value });
    }, [store]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        store.setLoading(true);
        store.setError(null);

        try {
            const result = await learningStyleService.predictLearningStyle(store.formData);
            store.setResult(result);
            store.setActiveTab('results');
        } catch (error) {
            store.setError(error instanceof Error ? error.message : 'Prediction failed');
        } finally {
            setIsSubmitting(false);
            store.setLoading(false);
        }
    }, [store]);

    const handleReset = useCallback(() => {
        store.resetForm();
        store.clearResults();
        store.setActiveTab('form');
    }, [store]);

    // Show results if available
    if (store.result && store.activeTab === 'results') {
        const PrimaryIcon = store.result.primary_style ? styleIcons[store.result.primary_style] : Brain;
        const primaryStyle = store.result.primary_style || 'unknown';

        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Brain className="h-8 w-8 text-primary" />
                            Learning Style Analysis
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Student ID: {store.formData.student_id}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        New Analysis
                    </Button>
                </div>

                {/* Primary Style Card */}
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${styleColors[primaryStyle as keyof typeof styleColors] || 'bg-gray-100'}`}>
                                <PrimaryIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <span className="text-2xl capitalize">{primaryStyle} Learner</span>
                                <Badge className="ml-3">{store.result.confidence}% Confidence</Badge>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Secondary style: <span className="capitalize font-medium">{store.result.secondary_style}</span>
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Style Scores */}
                <Card>
                    <CardHeader>
                        <CardTitle>Style Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(store.result.style_scores).map(([style, score]) => {
                            const Icon = styleIcons[style as keyof typeof styleIcons];
                            return (
                                <div key={style} className="flex items-center gap-4">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <span className="capitalize w-24">{style}</span>
                                    <Progress value={score} className="flex-1" />
                                    <span className="w-12 text-right font-medium">{score}%</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Personalized Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {store.result.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Badge variant="outline">{index + 1}</Badge>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show form
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    Learning Style Predictor
                </h1>
                <p className="text-muted-foreground mt-2">
                    Discover your preferred learning style to optimize your study approach
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="student_id">Student ID</Label>
                            <Input
                                id="student_id"
                                name="student_id"
                                value={store.formData.student_id}
                                onChange={handleInputChange}
                                placeholder="Enter student ID"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Preferences</CardTitle>
                        <CardDescription>Rate your preferences on a scale of 1-5</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Diagrams & Visual Aids
                            </Label>
                            <Slider
                                value={[store.formData.prefers_diagrams]}
                                onValueChange={(v) => handleSliderChange('prefers_diagrams', v)}
                                min={1}
                                max={5}
                                step={1}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Not preferred</span>
                                <span>Highly preferred</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Headphones className="h-4 w-4" />
                                Lectures & Audio
                            </Label>
                            <Slider
                                value={[store.formData.prefers_lectures]}
                                onValueChange={(v) => handleSliderChange('prefers_lectures', v)}
                                min={1}
                                max={5}
                                step={1}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Reading & Text
                            </Label>
                            <Slider
                                value={[store.formData.prefers_reading]}
                                onValueChange={(v) => handleSliderChange('prefers_reading', v)}
                                min={1}
                                max={5}
                                step={1}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                                <Hand className="h-4 w-4" />
                                Hands-on Activities
                            </Label>
                            <Slider
                                value={[store.formData.prefers_hands_on]}
                                onValueChange={(v) => handleSliderChange('prefers_hands_on', v)}
                                min={1}
                                max={5}
                                step={1}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Study Habits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Study Habits</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Note-Taking Style</Label>
                            <Select
                                value={store.formData.note_taking_style}
                                onValueChange={(v) => handleSelectChange('note_taking_style', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="visual">Visual (diagrams, mind maps)</SelectItem>
                                    <SelectItem value="written">Written (detailed notes)</SelectItem>
                                    <SelectItem value="audio">Audio (recordings)</SelectItem>
                                    <SelectItem value="mixed">Mixed approach</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Study Environment</Label>
                            <Select
                                value={store.formData.study_environment}
                                onValueChange={(v) => handleSelectChange('study_environment', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="quiet">Quiet (library, private room)</SelectItem>
                                    <SelectItem value="music">With music/background noise</SelectItem>
                                    <SelectItem value="group">Group/collaborative setting</SelectItem>
                                    <SelectItem value="varies">Varies by task</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>How do you best retain information?</Label>
                            <Select
                                value={store.formData.retention_method}
                                onValueChange={(v) => handleSelectChange('retention_method', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seeing">Seeing (visual memory)</SelectItem>
                                    <SelectItem value="hearing">Hearing (auditory memory)</SelectItem>
                                    <SelectItem value="doing">Doing (muscle memory)</SelectItem>
                                    <SelectItem value="reading">Reading (text memory)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Time Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Activity Time (minutes per session)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="video_watch_time">Video Watching</Label>
                            <Input
                                id="video_watch_time"
                                name="video_watch_time"
                                type="number"
                                value={store.formData.video_watch_time}
                                onChange={handleInputChange}
                                min={0}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reading_time">Reading</Label>
                            <Input
                                id="reading_time"
                                name="reading_time"
                                type="number"
                                value={store.formData.reading_time}
                                onChange={handleInputChange}
                                min={0}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interactive_time">Interactive Activities</Label>
                            <Input
                                id="interactive_time"
                                name="interactive_time"
                                type="number"
                                value={store.formData.interactive_time}
                                onChange={handleInputChange}
                                min={0}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Error Display */}
                {store.error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                        {store.error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4 mr-2" />
                                Analyze Learning Style
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LearningStylePredictor;
