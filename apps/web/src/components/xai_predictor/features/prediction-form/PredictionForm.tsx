import { Database } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { AcademicPerformanceSection } from './AcademicPerformanceSection';
import { EngagementSection } from './EngagementSection';
import { FormActions } from './FormActions';
import { HistoricalDataSection } from './HistoricalDataSection';
import { StudentInfoSection } from './StudentInfoSection';
import type { PredictionFormProps } from './types';

// Icons imports (some were in original file, keeping them if used in header)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, GraduationCap, History, User } from 'lucide-react';

export function PredictionForm({
    form,
    onSubmit,
    onClearDraft,
    isLoading,
    isHealthy
}: PredictionFormProps) {
    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Form Header */}
                <div className="border-b pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold tracking-tight">Student Risk Analysis</h2>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Enter student data to generate AI-powered risk predictions and intervention plans.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <User className="h-5 w-5 text-primary" />
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <StudentInfoSection />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-muted">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    Academic Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <AcademicPerformanceSection />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Engagement Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <EngagementSection />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-muted">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <History className="h-5 w-5 text-primary" />
                                    Historical Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <HistoricalDataSection />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Form Footer */}
                <div className="sticky bottom-0 z-10 mx-auto max-w-full bg-background border-t p-4 shadow-lg -mx-6 -mb-6 mt-6 flex justify-center">
                    <div className="w-full max-w-4xl">
                        <FormActions
                            isLoading={isLoading}
                            isHealthy={isHealthy}
                            onClearDraft={onClearDraft}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}