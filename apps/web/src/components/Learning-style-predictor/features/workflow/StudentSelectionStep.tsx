import { Loader2, Search } from 'lucide-react';
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" id="step1Card">
            <div className="mb-3">
                <div className="mb-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">Step 1</div>
                <h2 className="text-lg font-bold text-slate-900">Select Student</h2>
                <p className="text-sm text-slate-600">Enter or select a student ID to begin analysis</p>
            </div>

            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative grid gap-1.5">
                    <label htmlFor="studentLookup" className="text-xs font-semibold uppercase tracking-wide text-slate-700">Student ID</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden="true" />
                        <input
                            id="studentLookup"
                            type="text"
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            value={studentLookup}
                            onChange={(event) => onStudentLookupChange(event.target.value)}
                            placeholder="Type student ID (e.g., STU0001)"
                            onFocus={onOpenStudentList}
                            onBlur={() => {
                                window.setTimeout(onCloseStudentList, STUDENT_LIST_CLOSE_DELAY_MS);
                            }}
                        />
                    </div>

                    {isStudentListOpen && filteredStudents.length > 0 ? (
                        <div
                            className="absolute top-[calc(100%+0.3rem)] z-20 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
                            role="listbox"
                            aria-label="Student suggestions"
                        >
                            {filteredStudents.map((student) => (
                                <button
                                    key={student}
                                    type="button"
                                    className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm text-slate-900 hover:bg-indigo-50 hover:text-indigo-800"
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

                <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                    onClick={() => void onLoadStudentProfile()}
                    disabled={isLoadingProfile}
                >
                    {isLoadingProfile ? <Loader2 size={18} className="animate-spin" /> : null}
                    <span>{isLoadingProfile ? 'Loading...' : 'Load Student Profile'}</span>
                </button>
            </div>

            {profile ? (
                <div className="mt-3 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4" id="studentProfileCard">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                            <span id="studentInitials">{profile.studentId.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 id="profileStudentId" className="text-base font-bold text-slate-900">{profile.studentId}</h3>
                            <p id="profileMetadata" className="text-xs text-slate-600">Profile loaded successfully</p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div className="rounded-lg border border-indigo-200 bg-white/80 p-2.5">
                            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Preferred Difficulty</span>
                            <span className="mt-0.5 block text-sm font-bold text-slate-900" id="profileDifficulty">{profile.preferredDifficulty}</span>
                        </div>
                        <div className="rounded-lg border border-indigo-200 bg-white/80 p-2.5">
                            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Completion Rate</span>
                            <span className="mt-0.5 block text-sm font-bold text-slate-900" id="profileCompletionRate">{profile.completionRate}%</span>
                        </div>
                        <div className="rounded-lg border border-indigo-200 bg-white/80 p-2.5">
                            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Days Tracked</span>
                            <span className="mt-0.5 block text-sm font-bold text-slate-900" id="profileDaysTracked">{profile.daysTracked}</span>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
