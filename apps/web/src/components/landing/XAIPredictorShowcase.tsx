import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Check } from 'lucide-react';

export function XAIPredictorShowcase() {
    const navigate = useNavigate();

    const features = [
        'Real-time risk assessment with 95% accuracy',
        'Explainable AI insights for transparency',
        'Personalized intervention strategies',
        'Interactive what-if scenario analysis',
        'Comprehensive student analytics dashboard',
        'Automated action plan generation'
    ];

    return (
        <section id="xai-predictor" className="py-20 bg-gradient-to-b from-blue-50/50 to-purple-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
                            <span className="text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                                XAI Predictor
                            </span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                            Predict Student Risk with{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI Precision
                            </span>
                        </h2>

                        <p className="text-xl text-muted-foreground">
                            Our advanced XAI (Explainable AI) system analyzes multiple factors to predict student academic risk,
                            providing actionable insights and personalized intervention strategies.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="mt-1 p-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Button
                            size="lg"
                            onClick={() => navigate({ to: '/analytics' })}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            Try XAI Predictor Now
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Right Column - Visual/Screenshot */}
                    <div className="relative">
                        <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-border">
                            {/* Mock Dashboard */}
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-border">
                                    <h3 className="text-lg font-bold text-foreground">Risk Assessment Dashboard</h3>
                                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                        Live
                                    </div>
                                </div>

                                {/* Risk Gauge Mockup */}
                                <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-200"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="url(#gradient)"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray="351.86"
                                                strokeDashoffset="87.96"
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#3b82f6" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-foreground">75%</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-muted-foreground">Safety Score</p>
                                </div>

                                {/* Action Items */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Recommended Actions</p>
                                    {['Improve attendance tracking', 'Schedule tutoring session', 'Monitor assignment completion'].map((action, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-sm text-foreground">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </section>
    );
}
