import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';

export function CoursesSection() {
    const courses = [
        {
            title: "Introduction to Machine Learning",
            description: "Learn the fundamentals of ML algorithms, data preprocessing, and model evaluation.",
            level: "Beginner",
            duration: "8 hours",
            students: "1,234",
            variant: "default" as const
        },
        {
            title: "Full-Stack Web Development",
            description: "Master modern web technologies including React, Node.js, and database management.",
            level: "Intermediate",
            duration: "12 hours",
            students: "2,456",
            variant: "secondary" as const
        },
        {
            title: "Deep Learning & Neural Networks",
            description: "Advanced course covering deep neural networks, CNNs, RNNs, and transfer learning.",
            level: "Advanced",
            duration: "16 hours",
            students: "856",
            variant: "destructive" as const
        }
    ];

    return (
        <section id="courses" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20">Featured</Badge>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Courses</h2>
                    <p className="text-muted-foreground max-w-2xl">View and manage all courses in the platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <Card key={index} className="flex flex-col border-border hover:shadow-xl transition-all duration-300 group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={course.variant === 'default' ? 'default' : course.variant === 'secondary' ? 'secondary' : 'default'} className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                        {course.level}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {course.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {course.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students} students</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline">Edit Course</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
