import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Activity, ArrowRight, Brain, GraduationCap, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeroSection() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const suites = [
        {
            icon: <Brain className="w-16 h-16 text-white" />,
            gradient: 'from-blue-600 to-purple-600',
            title: 'XAI Risk Prediction',
            description: 'Predict student academic risk with AI precision. Identify at-risk students early and implement targeted interventions that drive success.',
            ctaText: 'Try XAI Predictor',
            ctaRoute: '/analytics',
            features: [
                'Real-time Risk Assessment',
                'Personalized Action Plans',
                'Explainable AI Insights',
                'Predictive Analytics'
            ]
        },
        {
            icon: <Activity className="w-16 h-16 text-white" />,
            gradient: 'from-emerald-600 to-teal-600',
            title: 'Engagement Prediction',
            description: 'Track and boost student engagement with behavioral analytics. Detect disengagement early and implement strategies that re-ignite participation.',
            ctaText: 'Try Engagement Predictor',
            ctaRoute: '/engagement',
            features: [
                'Real-time Tracking',
                'Behavioral Analytics',
                'Early Alerts',
                'Trend Analysis'
            ]
        },
        {
            icon: <GraduationCap className="w-16 h-16 text-white" />,
            gradient: 'from-orange-600 to-rose-600',
            title: 'Learning Style Analysis',
            description: 'Personalize learning for every student with AI-powered style analysis. Deliver customized content that maximizes individual success.',
            ctaText: 'Try Learning Style Predictor',
            ctaRoute: '/learning-style',
            features: [
                'AI-Powered Analysis',
                'Visual Learners',
                'Auditory Learners',
                'Personalized Paths'
            ]
        }
    ];

    // Auto-rotate slides every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % suites.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [suites.length]);

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/images/hero-background.png"
                    alt="EduMind AI Background"
                    className="w-full h-full object-cover"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40" />
            </div>

            {/* Animated elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-blue-300" />
                            <span className="text-sm font-medium text-white">AI-Powered Learning Platform</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                EduMind
                            </span>
                        </h1>

                        {/* Subheading - Dynamic based on current suite */}
                        <div className="relative h-24 overflow-hidden">
                            {suites.map((suite, index) => (
                                <p
                                    key={index}
                                    className={`absolute inset-0 text-xl text-slate-200 max-w-2xl transition-all duration-700 ${index === currentSlide
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    {suite.description}
                                </p>
                            ))}
                        </div>

                        {/* CTA Buttons - Dynamic based on current suite */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: suites[currentSlide].ctaRoute })}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                {suites[currentSlide].ctaText}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => scrollToSection('features')}
                                className="border-2 border-white/50 bg-white/10 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all duration-300"
                            >
                                Learn More
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-white">95%</div>
                                <div className="text-sm text-slate-300">Prediction Accuracy</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">10k+</div>
                                <div className="text-sm text-slate-300">Students Helped</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-sm text-slate-300">AI Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Auto-Rotating Suite Slider */}
                    <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-300">
                        <div className="relative">
                            {/* Floating card with slider */}
                            <div className="relative bg-card rounded-2xl shadow-2xl p-8 border border-border overflow-hidden">
                                {/* Suite slider */}
                                <div className="relative h-80">
                                    {suites.map((suite, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                                                ? 'opacity-100 translate-x-0'
                                                : index < currentSlide
                                                    ? 'opacity-0 -translate-x-full'
                                                    : 'opacity-0 translate-x-full'
                                                }`}
                                        >
                                            {/* Icon with gradient */}
                                            <div className="flex items-center justify-center mb-6">
                                                <div className="relative">
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${suite.gradient} rounded-full blur-xl opacity-50 animate-pulse`} />
                                                    <div className={`relative bg-gradient-to-r ${suite.gradient} p-6 rounded-full`}>
                                                        {suite.icon}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Suite title */}
                                            <h3 className={`text-2xl font-bold text-center mb-6 bg-gradient-to-r ${suite.gradient} bg-clip-text text-transparent`}>
                                                {suite.title}
                                            </h3>

                                            {/* Feature list */}
                                            <div className="space-y-4">
                                                {suite.features.map((feature) => (
                                                    <div
                                                        key={feature}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${suite.gradient}`} />
                                                        <span className="text-sm font-medium text-foreground">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Slide indicators */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {suites.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'w-8 bg-gradient-to-r from-blue-600 to-purple-600'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <div className="w-1 h-2 rounded-full bg-white/50" />
                </div>
            </div>
        </section>
    );
}
