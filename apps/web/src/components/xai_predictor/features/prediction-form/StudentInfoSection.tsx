import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { StudentRiskRequest } from '../../core/schemas/xai.schemas';

export function StudentInfoSection() {
    const { register, formState: { errors } } = useFormContext<StudentRiskRequest>();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="student_id" className="flex items-center gap-2 font-semibold">
                        <GraduationCap size={16} className="text-blue-600" />
                        Student ID
                    </Label>
                    <Input
                        id="student_id"
                        {...register('student_id')}
                        placeholder="Enter student ID (e.g., student_12345)"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {errors.student_id && <p className="text-sm text-destructive">{errors.student_id.message}</p>}
                    <span className="block text-sm text-muted-foreground italic">
                        Unique identifier for the student
                    </span>
                </div>
            </div>
        </div>
    );
}