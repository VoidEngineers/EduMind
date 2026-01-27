import { BookOpen, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type {StatCardProps} from './types';

function StatCard({ icon, value, label, suffix = '', color }: StatCardProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div
            ref={cardRef}
            className={`group relative bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

            <div className="relative flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                    <div className="text-white">
                        {icon}
                    </div>
                </div>

                {/* Value */}
                <div className="text-4xl sm:text-5xl font-bold text-foreground">
                    {count.toLocaleString()}{suffix}
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </div>
            </div>
        </div>
    );
}

export function StatsSection() {
    return (
        <section id="stats" className="py-20 bg-gradient-to-b from-background to-blue-50/50 dark:to-blue-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                        <span className="text-sm font-medium text-blue-700">Our Impact</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                        Transforming Education with{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Data & AI
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Real-time insights and predictive analytics helping thousands of students succeed
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        icon={<Users size={32} />}
                        value={1250}
                        label="Total Students"
                        color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                        icon={<BookOpen size={32} />}
                        value={48}
                        label="Active Courses"
                        color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                        icon={<GraduationCap size={32} />}
                        value={8500}
                        label="Learning Resources"
                        color="from-green-500 to-green-600"
                    />
                    <StatCard
                        icon={<TrendingUp size={32} />}
                        value={95}
                        suffix="%"
                        label="Success Rate"
                        color="from-orange-500 to-orange-600"
                    />
                </div>
            </div>
        </section>
    );
}
