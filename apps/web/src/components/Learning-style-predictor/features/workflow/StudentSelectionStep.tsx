import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { StudentProfileSummaryData } from '../../data/interfaces';
import { STUDENT_LIST_CLOSE_DELAY_MS } from '../../core/constants/uiConfig';

interface StudentSelectionStepProps {
    studentLookup: string;
    filteredStudents: string[];
    isStudentListOpen: boolean;
    profile: StudentProfileSummaryData | null;
    isLoadingProfile: boolean;
    onStudentLookupChange: (value: string) => void;
    onOpenStudentList: () => void;
    onCloseStudentList: () => void;
    onSelectStudent: (student: string) => void;
    onLoadStudentProfile: () => Promise<void>;
}

export function StudentSelectionStep({
    studentLookup,
    filteredStudents,
    isStudentListOpen,
    profile,
    isLoadingProfile,
    onStudentLookupChange,
    onOpenStudentList,
    onCloseStudentList,
    onSelectStudent,
    onLoadStudentProfile,
}: StudentSelectionStepProps) {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="pb-4 border-b">
                <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Step 1</div>
                <CardTitle>Select Student</CardTitle>
                <CardDescription>Enter a student ID and load profile context before running analysis.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="relative space-y-2">
                        <Label htmlFor="studentLookup">Student ID</Label>
                        <Input
                            id="studentLookup"
                            value={studentLookup}
                            onChange={(event) => onStudentLookupChange(event.target.value)}
                            placeholder="Type student ID (e.g., STU0001)"
                            className="bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary"
                            onFocus={onOpenStudentList}
                            onBlur={() => {
                                window.setTimeout(onCloseStudentList, STUDENT_LIST_CLOSE_DELAY_MS);
                            }}
                        />
                        {isStudentListOpen && filteredStudents.length > 0 ? (
                            <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                                {filteredStudents.map((student) => (
                                    <button
                                        key={student}
                                        type="button"
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            onSelectStudent(student);
                                        }}
                                    >
                                        {student}
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    <Button
                        onClick={() => void onLoadStudentProfile()}
                        disabled={isLoadingProfile}
                        className="self-end"
                    >
                        {isLoadingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Load Student Profile
                    </Button>
                </div>

                {profile ? (
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Student</p>
                                <p className="font-semibold text-foreground">{profile.studentId}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Completion Rate</p>
                                <p className="font-semibold text-foreground">{profile.completionRate}%</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Days Tracked</p>
                                <p className="font-semibold text-foreground">{profile.daysTracked}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Preferred Intensity: <span className="font-semibold text-foreground">{profile.preferredDifficulty}</span>
                        </p>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
