import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

export function TailwindTestComponent() {
    const [progress, setProgress] = useState(33)
    const [sliderValue, setSliderValue] = useState([50])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tailwind CSS + shadcn/ui Test
                    </h1>
                    <p className="text-muted-foreground">
                        Testing all components and Tailwind utilities
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </div>

                {/* Card with Form */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle>Form Example</CardTitle>
                        <CardDescription>
                            Testing Input, Label, and Button components
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Enter your name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button variant="default">Submit</Button>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="ghost">Reset</Button>
                    </CardFooter>
                </Card>

                {/* Progress and Slider */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Progress & Slider</CardTitle>
                        <CardDescription>Interactive components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Progress: {progress}%</Label>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setProgress((prev) => (prev + 10) % 110)}
                                >
                                    Increment
                                </Button>
                            </div>
                            <Progress value={progress} />
                        </div>
                        <div className="space-y-2">
                            <Label>Slider Value: {sliderValue[0]}</Label>
                            <Slider
                                value={sliderValue}
                                onValueChange={setSliderValue}
                                max={100}
                                step={1}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Dialog Example */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Dialog Component</CardTitle>
                        <CardDescription>Modal dialog example</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default">Open Dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        This is a test dialog component. It demonstrates the modal functionality.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Confirm</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Button Variants */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Button Variants</CardTitle>
                        <CardDescription>All button styles and sizes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="default">Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon">🎨</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tailwind Utilities Test */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Tailwind Utilities</CardTitle>
                        <CardDescription>Testing gradients, animations, and responsive design</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold">
                            Gradient Background
                        </div>
                        <div className="p-4 bg-primary text-primary-foreground rounded-lg animate-pulse">
                            Animated Pulse
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-secondary rounded-lg">Responsive 1</div>
                            <div className="p-4 bg-secondary rounded-lg">Responsive 2</div>
                            <div className="p-4 bg-secondary rounded-lg">Responsive 3</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
