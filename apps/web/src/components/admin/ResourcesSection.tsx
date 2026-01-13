import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Code, FileText, Video } from 'lucide-react';

export function ResourcesSection() {
    const resources = [
        {
            title: "Documentation",
            description: "Comprehensive guides and technical documentation",
            count: "2,450+ docs",
            icon: FileText,
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            title: "Video Tutorials",
            description: "Step-by-step video lessons from experts",
            count: "1,200+ videos",
            icon: Video,
            color: "bg-red-500/10 text-red-500"
        },
        {
            title: "Interactive Exercises",
            description: "Practice with hands-on coding challenges",
            count: "3,800+ exercises",
            icon: Code,
            color: "bg-green-500/10 text-green-500"
        },
        {
            title: "E-Books",
            description: "Downloadable books and study materials",
            count: "850+ books",
            icon: Book,
            color: "bg-amber-500/10 text-amber-500"
        }
    ];

    return (
        <section id="resources" className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">Library</span>
                    <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
                    <p className="text-muted-foreground max-w-2xl">Manage and organize all learning resources</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, index) => (
                        <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-4`}>
                                    <resource.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                                <CardDescription>{resource.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold text-sm">{resource.count}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
