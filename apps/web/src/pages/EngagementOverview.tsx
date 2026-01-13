import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Activity, ArrowRight, BarChart3, Bell, Eye, MessageSquare, TrendingUp, Users, Zap } from 'lucide-react';

export default function EngagementOverview() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-300">Engagement Prediction</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Track & Boost
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                                Student Engagement
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Leverage behavioral analytics and real-time tracking to identify disengaged students early and implement targeted strategies.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: '/engagement' })}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg"
                            >
                                Try Engagement Predictor
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
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">60%</div>
                                <div className="text-sm text-slate-400 mt-2">Increase</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">24/7</div>
                                <div className="text-sm text-slate-400 mt-2">Monitoring</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">85%</div>
                                <div className="text-sm text-slate-400 mt-2">Accuracy</div>
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
                        <p className="text-xl text-slate-600">Everything you need to track and improve student engagement</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Activity className="w-6 h-6" />, title: 'Real-time Tracking', desc: 'Monitor engagement levels continuously with instant updates', gradient: 'from-emerald-500 to-teal-500' },
                            { icon: <BarChart3 className="w-6 h-6" />, title: 'Behavioral Analytics', desc: 'Analyze interaction patterns and participation rates', gradient: 'from-teal-500 to-cyan-500' },
                            { icon: <Bell className="w-6 h-6" />, title: 'Early Alerts', desc: 'Get notified when engagement drops below thresholds', gradient: 'from-cyan-500 to-blue-500' },
                            { icon: <TrendingUp className="w-6 h-6" />, title: 'Trend Analysis', desc: 'Identify patterns and predict future disengagement', gradient: 'from-green-500 to-emerald-500' },
                            { icon: <MessageSquare className="w-6 h-6" />, title: 'Interaction Metrics', desc: 'Track posts, submissions, and material access', gradient: 'from-blue-500 to-indigo-500' },
                            { icon: <Zap className="w-6 h-6" />, title: 'Auto Interventions', desc: 'Trigger personalized engagement strategies', gradient: 'from-indigo-500 to-purple-500' }
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
            <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Proven Results</h2>
                        <p className="text-xl text-emerald-100">Transform student participation with data-driven strategies</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        {[
                            { icon: <TrendingUp />, text: 'Increase student engagement by up to 60%' },
                            { icon: <Zap />, text: 'Detect disengagement 3-4 weeks earlier' },
                            { icon: <Activity />, text: 'Reduce course abandonment rates' },
                            { icon: <Users />, text: 'Personalized re-engagement campaigns' },
                            { icon: <BarChart3 />, text: 'Track intervention success rates' },
                            { icon: <Eye />, text: 'Comprehensive engagement dashboards' }
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
                            onClick={() => navigate({to:'/engagement'})}
                            className="bg-white text-emerald-600 hover:bg-slate-100 px-10 py-6 text-lg font-semibold"
                        >
                            Start Tracking Engagement Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
