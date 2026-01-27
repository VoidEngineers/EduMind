import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                    Ready to Transform Student Outcomes?
                </h2>

                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    Join thousands of educators using AI-powered insights to identify at-risk students
                    and drive academic success.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        size="lg"
                        onClick={() => navigate({ to: '/pricing' })}
                        className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        className="border-2 border-white bg-transparent text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-medium"
                    >
                        Schedule Demo
                    </Button>
                </div>

                <p className="text-sm text-white/70 pt-4">
                    No credit card required • Free 14-day trial • Cancel anytime
                </p>
            </div>
        </section>
    );
}
