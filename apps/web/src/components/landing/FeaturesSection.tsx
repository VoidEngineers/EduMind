import { useNavigate } from '@tanstack/react-router';
import { Activity, BarChart3, Brain, GraduationCap, LineChart, Shield, Sparkles, Target } from 'lucide-react';
import type {FeatureCardProps} from './types';

function FeatureCard({ icon, title, description, gradient, stats, route }: FeatureCardProps) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => route && navigate({ to: route })}
            className={`group relative bg-card rounded-3xl p-8 border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${route ? 'cursor-pointer' : ''
                }`}
        >
            {/* Gradient glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500`} />

            <div className="relative space-y-6">
                {/* Icon with animated background */}
                <div className="relative inline-flex">
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${gradient}`}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        {description}
                    </p>
                </div>

                {/* Stats badge */}
                {stats && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} animate-pulse`} />
                        <span className="text-sm font-semibold text-foreground">{stats}</span>
                    </div>
                )}

                {/* Hover arrow */}
                {route && (
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                        <span>Explore</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-900/10 to-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 shadow-lg">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                            AI-Powered Platform
                        </span>
                    </div>

                    <h2 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                        Everything You Need to{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Transform Education
                        </span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Comprehensive suite of AI-powered tools designed to predict, analyze, and enhance student success through data-driven insights
                    </p>
                </div>

                {/* Main Prediction Features - Highlighted */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                        Core Prediction Suite
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain size={32} />}
                            title="XAI Risk Prediction"
                            description="Advanced machine learning models predict student academic risk with 95% accuracy, providing early intervention opportunities and actionable insights."
                            gradient="from-blue-500 to-blue-600"
                            stats="Student Dropout Prediction"
                            route="/xai-risk-overview"
                        />

                        <FeatureCard
                            icon={<Activity size={32} />}
                            title="Engagement Prediction"
                            description="Real-time behavioral analytics track student engagement levels, identifying disengagement patterns before they impact performance."
                            gradient="from-green-500 to-teal-600"
                            stats="Real-time Tracking"
                            route="/engagement-overview"
                        />

                        <FeatureCard
                            icon={<GraduationCap size={32} />}
                            title="Learning Style Analysis"
                            description="Identify individual learning preferences to deliver personalized educational content and optimize teaching methods for each student."
                            gradient="from-orange-500 to-pink-600"
                            stats="Personalized Paths"
                            route="/learning-style-overview"
                        />
                    </div>
                </div>

                {/* Supporting Features */}
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
                        Platform Capabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Sparkles size={28} />}
                            title="Explainable AI"
                            description="Transparent insights into prediction factors with clear explanations of the 'why' behind each assessment."
                            gradient="from-purple-500 to-purple-600"
                        />

                        <FeatureCard
                            icon={<Target size={28} />}
                            title="Action Plans"
                            description="AI-generated intervention strategies tailored to each student's unique needs and risk factors."
                            gradient="from-pink-500 to-pink-600"
                        />

                        <FeatureCard
                            icon={<BarChart3 size={28} />}
                            title="Live Analytics"
                            description="Real-time dashboards tracking engagement, performance trends, and intervention effectiveness."
                            gradient="from-green-500 to-green-600"
                        />

                        <FeatureCard
                            icon={<LineChart size={28} />}
                            title="Predictive Insights"
                            description="Forecast academic outcomes and identify critical patterns before they escalate."
                            gradient="from-orange-500 to-orange-600"
                        />

                        <FeatureCard
                            icon={<Shield size={28} />}
                            title="Data Security"
                            description="Enterprise-grade security with GDPR compliance ensuring complete data protection."
                            gradient="from-cyan-500 to-cyan-600"
                        />

                        <FeatureCard
                            icon={<Brain size={28} />}
                            title="Smart Recommendations"
                            description="AI-powered suggestions for optimal learning paths and resource allocation."
                            gradient="from-indigo-500 to-indigo-600"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
