import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard } from 'lucide-react';

interface AdminHeroProps {
    scrollToSection: (id: string) => void;
}

export function AdminHero({ scrollToSection }: AdminHeroProps) {
    return (
        <section className="relative py-20 overflow-hidden bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide">System Online</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduMind LMS</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                Your intelligent learning management system powered by AI.
                                Manage courses, track student progress, and optimize your educational platform.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                onClick={() => scrollToSection('courses')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                            >
                                <Brain className="mr-2 h-5 w-5" />
                                Manage Courses
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => scrollToSection('dashboard')}
                                className="border-2 hover:bg-accent"
                            >
                                <LayoutDashboard className="mr-2 h-5 w-5" />
                                View Dashboard
                            </Button>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                        <div className="relative bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
                            <div className="flex items-center justify-center h-64">
                                <Brain className="w-32 h-32 text-primary opacity-80" />
                            </div>
                            <p className="text-center font-medium text-muted-foreground mt-4">AI-Powered Learning Platform</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
