import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import type { StudentInfoSectionProps } from './types';

export function StudentInfoSection({ formData, onInputChange }: StudentInfoSectionProps) {
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
                        type="text"
                        name="student_id"
                        value={formData.student_id}
                        onChange={onInputChange}
                        required
                        placeholder="Enter student ID (e.g., student_12345)"
                        aria-describedby="student_id_hint"
                        className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span id="student_id_hint" className="block text-sm text-muted-foreground italic">
                        Unique identifier for the student
                    </span>
                </div>
            </div>
        </div>
    );
}