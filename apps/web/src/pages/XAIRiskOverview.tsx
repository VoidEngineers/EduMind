import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, BarChart3, Brain, Lightbulb, Shield, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

export default function XAIRiskOverview() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                            <Brain className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-300">XAI Risk Prediction</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Predict Student Risk with
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                                AI Precision
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Leverage cutting-edge explainable AI to identify at-risk students early and implement targeted interventions that drive success.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: '/analytics' })}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
                            >
                                Try XAI Predictor
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate({ to: '/' })}
                                className="border-2 border-white/50 bg-white/10 text-white hover:bg-white hover:text-slate-900 hover:border-white px-8 py-6 text-lg transition-all duration-300 backdrop-blur-sm"
                            >
                                Back to Home
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">95%</div>
                                <div className="text-sm text-slate-400 mt-2">Accuracy</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">10k+</div>
                                <div className="text-sm text-slate-400 mt-2">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">40%</div>
                                <div className="text-sm text-slate-400 mt-2">Reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-slate-600">Everything you need to predict and prevent student academic risk</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Brain className="w-6 h-6" />, title: 'Advanced ML Models', desc: 'State-of-the-art algorithms trained on thousands of data points', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: <Target className="w-6 h-6" />, title: '95% Accuracy', desc: 'Industry-leading prediction accuracy validated globally', gradient: 'from-cyan-500 to-teal-500' },
                            { icon: <Lightbulb className="w-6 h-6" />, title: 'Explainable AI', desc: 'Transparent insights showing why students are at-risk', gradient: 'from-teal-500 to-green-500' },
                            { icon: <TrendingUp className="w-6 h-6" />, title: 'Early Detection', desc: 'Identify at-risk students 4-6 weeks earlier', gradient: 'from-green-500 to-emerald-500' },
                            { icon: <BarChart3 className="w-6 h-6" />, title: 'Real-time Updates', desc: 'Continuous monitoring with instant alerts', gradient: 'from-indigo-500 to-purple-500' },
                            { icon: <Shield className="w-6 h-6" />, title: 'Privacy First', desc: 'GDPR-compliant enterprise-grade security', gradient: 'from-purple-500 to-pink-500' }
                        ].map((feature, i) => (
                            <div key={i} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                                <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Proven Results</h2>
                        <p className="text-xl text-blue-100">Join institutions seeing measurable improvements</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        {[
                            { icon: <TrendingUp />, text: 'Reduce dropout rates by up to 40%' },
                            { icon: <Zap />, text: 'Identify struggling students 4-6 weeks earlier' },
                            { icon: <Target />, text: 'Personalized intervention strategies' },
                            { icon: <BarChart3 />, text: 'Track intervention effectiveness in real-time' },
                            { icon: <Brain />, text: 'Comprehensive risk factor analysis' },
                            { icon: <Sparkles />, text: 'Automated action plan generation' }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex-shrink-0 text-white">{benefit.icon}</div>
                                <span className="text-white font-medium">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            onClick={() => navigate({ to: '/analytics' })}
                            className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-6 text-lg font-semibold"
                        >
                            Start Predicting Risk Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
