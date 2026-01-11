import { GraduationCap, Users } from 'lucide-react';
import type { StudentInfoSectionProps } from './types';

export function StudentInfoSection({ formData, onInputChange }: StudentInfoSectionProps) {
    return (
        <>
            <div className="section-title">
                <Users size={20} />
                <span>Student Information</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="student_id">
                        <GraduationCap size={16} />
                        Student ID
                    </label>
                    <input
                        id="student_id"
                        type="text"
                        name="student_id"
                        value={formData.student_id}
                        onChange={onInputChange}
                        required
                        placeholder="Enter student ID (e.g., student_12345)"
                        aria-describedby="student_id_hint"
                    />
                    <span id="student_id_hint" className="input-hint">
                        Unique identifier for the student
                    </span>
                </div>
            </div>
        </>
    );
}