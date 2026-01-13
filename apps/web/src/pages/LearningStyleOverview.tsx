import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, BarChart3, BookOpen, Brain, Eye, GraduationCap, Headphones, Lightbulb, Palette, Target, TrendingUp, Users, Zap } from 'lucide-react';

export default function LearningStyleOverview() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-rose-900">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
                            <GraduationCap className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-semibold text-orange-300">Learning Style Prediction</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Personalize Learning
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400">
                                for Every Student
                            </span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Harness AI to identify individual learning preferences and deliver personalized educational content that maximizes student success.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: '/learning-style' })}
                                className="bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white px-8 py-6 text-lg"
                            >
                                Try Learning Style Predictor
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
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">50%</div>
                                <div className="text-sm text-slate-400 mt-2">Improvement</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">7+</div>
                                <div className="text-sm text-slate-400 mt-2">Styles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">90%</div>
                                <div className="text-sm text-slate-400 mt-2">Satisfaction</div>
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
                        <p className="text-xl text-slate-600">Everything you need to personalize learning for each student</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Brain className="w-6 h-6" />, title: 'AI-Powered Analysis', desc: 'Identify learning preferences from behavior and performance', gradient: 'from-orange-500 to-amber-500' },
                            { icon: <Eye className="w-6 h-6" />, title: 'Visual Learners', desc: 'Identify students who learn best through visual content', gradient: 'from-rose-500 to-pink-500' },
                            { icon: <Headphones className="w-6 h-6" />, title: 'Auditory Learners', desc: 'Detect students who excel with audio materials', gradient: 'from-pink-500 to-fuchsia-500' },
                            { icon: <Users className="w-6 h-6" />, title: 'Kinesthetic Learners', desc: 'Recognize hands-on learners who need practical activities', gradient: 'from-red-500 to-rose-500' },
                            { icon: <Target className="w-6 h-6" />, title: 'Personalized Paths', desc: 'Create customized learning journeys for each student', gradient: 'from-amber-500 to-yellow-500' },
                            { icon: <Lightbulb className="w-6 h-6" />, title: 'Smart Recommendations', desc: 'Suggest optimal teaching methods and materials', gradient: 'from-yellow-500 to-orange-500' }
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
            <section className="py-24 bg-gradient-to-br from-orange-600 to-rose-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Proven Results</h2>
                        <p className="text-xl text-orange-100">Deliver personalized education that adapts to each student</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        {[
                            { icon: <TrendingUp />, text: 'Improve learning outcomes by up to 50%' },
                            { icon: <Palette />, text: 'Personalize content for each student' },
                            { icon: <Zap />, text: 'Optimize teaching methods automatically' },
                            { icon: <GraduationCap />, text: 'Increase student satisfaction and retention' },
                            { icon: <BarChart3 />, text: 'Track learning style effectiveness' },
                            { icon: <BookOpen />, text: 'Adaptive content delivery system' }
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
                            onClick={() => navigate( {to:'/learning-style'})}
                            className="bg-white text-orange-600 hover:bg-slate-100 px-10 py-6 text-lg font-semibold"
                        >
                            Start Personalizing Learning Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
