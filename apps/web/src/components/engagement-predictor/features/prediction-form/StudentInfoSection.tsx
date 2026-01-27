import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SectionProps } from '../../core/types';

export function StudentInfoSection({ formData, onInputChange }: Omit<SectionProps, 'onSliderChange'>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                        id="student_id"
                        name="student_id"
                        value={formData.student_id}
                        onChange={onInputChange}
                        placeholder="Enter student ID"
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
}
