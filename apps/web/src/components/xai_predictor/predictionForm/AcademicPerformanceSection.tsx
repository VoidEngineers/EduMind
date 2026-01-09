import { Activity, ArrowUp, BarChart, CheckCircle, TrendingDown } from 'lucide-react';
import type { AcademicPerformanceSectionProps } from './types';

export function AcademicPerformanceSection({ formData, onInputChange }: AcademicPerformanceSectionProps) {
    return (
        <>
            <div className="section-title">
                <BarChart size={20} />
                <span>Academic Performance</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="avg_grade">
                        <TrendingDown size={16} />
                        Average Grade
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="avg_grade"
                            type="number"
                            name="avg_grade"
                            value={formData.avg_grade}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="avg_grade_hint"
                        />
                        <span className="input-suffix">%</span>
                    </div>
                    <span id="avg_grade_hint" className="input-hint">
                        Current: {formData.avg_grade}%
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="grade_consistency">
                        <Activity size={16} />
                        Grade Consistency
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="grade_consistency"
                            type="number"
                            name="grade_consistency"
                            value={formData.grade_consistency}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="grade_consistency_hint"
                        />
                        <span className="input-suffix">%</span>
                    </div>
                    <span id="grade_consistency_hint" className="input-hint">
                        Performance stability score
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="grade_range">
                        <ArrowUp size={16} />
                        Grade Range
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="grade_range"
                            type="number"
                            name="grade_range"
                            value={formData.grade_range}
                            onChange={onInputChange}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            placeholder="0-100"
                            aria-describedby="grade_range_hint"
                        />
                        <span className="input-suffix">pts</span>
                    </div>
                    <span id="grade_range_hint" className="input-hint">
                        Highest - Lowest grade
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="num_assessments">
                        <CheckCircle size={16} />
                        Number of Assessments
                    </label>
                    <input
                        id="num_assessments"
                        type="number"
                        name="num_assessments"
                        value={formData.num_assessments}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="Total assessments"
                        aria-describedby="num_assessments_hint"
                    />
                    <span id="num_assessments_hint" className="input-hint">
                        Completed assessments
                    </span>
                </div>
            </div>
        </>
    );
}