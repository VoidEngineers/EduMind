import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskAndStrengthsSectionProps {
    riskFactors: string[];
    strengths: string[];
}

export function RiskAndStrengthsSection({ riskFactors, strengths }: RiskAndStrengthsSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Risk Factors
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {riskFactors.length > 0 ? (
                        <ul className="space-y-2">
                            {riskFactors.map((factor, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    {factor}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">No significant risk factors identified</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Strengths
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {strengths.length > 0 ? (
                        <ul className="space-y-2">
                            {strengths.map((strength, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Building engagement strengths</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
