import { Navbar } from '@/components/landing/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, HelpCircle, Minus } from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Starter",
            description: "Perfect for individual educators and small classes.",
            price: { monthly: 0, annual: 0 },
            features: [
                "Up to 50 students",
                "Basic Risk Prediction",
                "Engagement Tracking",
                "Email Support"
            ],
            notIncluded: [
                "Learning Style Analytics",
                "Custom Interventions",
                "API Access",
                "SSO Integration"
            ],
            cta: "Get Started Free",
            variant: "outline" as const
        },
        {
            name: "Pro",
            description: "For schools and departments scaling AI adoption.",
            price: { monthly: 49, annual: 39 },
            popular: true,
            features: [
                "Up to 1,000 students",
                "Advanced Risk Analysis",
                "Learning Style Prediction",
                "Custom Action Plans",
                "Priority Support",
                "Team Collaboration"
            ],
            notIncluded: [
                "API Access",
                "SSO Integration"
            ],
            cta: "Start Free Trial",
            variant: "default" as const
        },
        {
            name: "Enterprise",
            description: "Custom solutions for universities and districts.",
            price: { monthly: "Custom", annual: "Custom" },
            features: [
                "Unlimited students",
                "Full AI Suite Access",
                "Custom API Integration",
                "SSO & Advanced Security",
                "Dedicated Success Manager",
                "Custom AI Model Training",
                "SLA Guarantees"
            ],
            notIncluded: [],
            cta: "Contact Sales",
            variant: "outline" as const
        }
    ];

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="pt-32 pb-20">
                {/* Header */}
                <div className="text-center space-y-4 mb-16 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect plan for your institution. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isAnnual ? 'bg-primary' : 'bg-input'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Yearly <span className="text-emerald-500 font-bold ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                {/* Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-border hover:shadow-lg transition-transform hover:-translate-y-1'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                        <Badge className="bg-primary text-primary-foreground hover:bg-primary px-4 py-1">Most Popular</Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">
                                            {typeof plan.price.monthly === 'number'
                                                ? `$${isAnnual ? plan.price.annual : plan.price.monthly}`
                                                : plan.price.monthly}
                                        </span>
                                        {typeof plan.price.monthly === 'number' && (
                                            <span className="text-muted-foreground">/month</span>
                                        )}
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <span className="text-sm text-foreground">{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                                    <Minus className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? 'default' : 'outline'}
                                        size="lg"
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ or Trust Section */}
                <div className="mt-24 text-center">
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Have questions? <a href="/docs" className="text-primary hover:underline">Check our documentation</a> or <a href="#" className="text-primary hover:underline">contact support</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
