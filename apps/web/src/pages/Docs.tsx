import { Navbar } from '@/components/landing/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Book, Check, Code, FileText, HelpCircle, Lightbulb, Search, Terminal, Zap } from 'lucide-react';

export default function Docs() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero Search */}
                <div className="bg-muted/30 py-16 border-b border-border">
                    <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                        <Badge variant="secondary" className="mb-4">Documentation v2.0</Badge>
                        <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search documentation..."
                                className="pl-12 h-12 text-lg bg-background shadow-sm rounded-full border-border focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Links Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                </div>
                                <CardTitle>Getting Started</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Quick start guides to integrate EduMind into your LMS. Setup in under 15 minutes.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
                                    <Terminal className="w-5 h-5 text-purple-500" />
                                </div>
                                <CardTitle>API Reference</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Detailed API endpoints, authentication methods, and response schemas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2 group-hover:bg-emerald-500/20 transition-colors">
                                    <Book className="w-5 h-5 text-emerald-500" />
                                </div>
                                <CardTitle>User Guides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Step-by-step tutorials for teachers and administrators on using dashboard features.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content Categories */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8">Browse by Topic</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Authentication", icon: Code },
                                { title: "Student Data Sync", icon: FileText },
                                { title: "Prediction Models", icon: Lightbulb },
                                { title: "Action Plans", icon: Check },
                                { title: "Reporting", icon: FileText },
                                { title: "Webhooks", icon: Zap },
                                { title: "Security", icon: Check },
                                { title: "Troubleshooting", icon: HelpCircle },
                            ].map((topic, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="h-auto py-4 justify-start px-4 text-base font-normal hover:border-primary/50 hover:bg-accent"
                                >
                                    <topic.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                                    {topic.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Help Footer */}
                <div className="max-w-4xl mx-auto mt-20 p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl border border-border text-center">
                    <h3 className="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
                    <p className="text-muted-foreground mb-6">Our support team is available 24/7 to help you with any questions.</p>
                    <div className="flex justify-center gap-4">
                        <Button>Contact Support</Button>
                        <Button variant="outline">Join Community</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
