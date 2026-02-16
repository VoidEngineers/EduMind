import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { EngagementSchema } from '../../core/types';

export function StudentInfoSection() {
    const { register, formState: { errors } } = useFormContext<EngagementSchema>();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                        id="student_id"
                        placeholder="Enter student ID"
                        {...register('student_id')}
                    />
                    {errors.student_id && <p className="text-sm text-destructive">{errors.student_id.message}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
