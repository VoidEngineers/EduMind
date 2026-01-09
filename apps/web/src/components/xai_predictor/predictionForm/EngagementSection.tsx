import { BookOpen, Clock, Target } from 'lucide-react';
import type { EngagementSectionProps } from './types';

export function EngagementSection({ formData, onInputChange }: EngagementSectionProps) {
    return (
        <>
            <div className="section-title">
                <Target size={20} />
                <span>Engagement Metrics</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="assessment_completion_rate">
                        <Clock size={16} />
                        Completion Rate
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="assessment_completion_rate"
                            type="number"
                            name="assessment_completion_rate"
                            value={formData.assessment_completion_rate}
                            onChange={onInputChange}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            placeholder="0.0 - 1.0"
                            aria-describedby="completion_rate_hint"
                        />
                        <span className="input-suffix">
                            {(formData.assessment_completion_rate * 100).toFixed(0)}%
                        </span>
                    </div>
                    <span id="completion_rate_hint" className="input-hint">
                        Decimal value (0 = 0%, 1 = 100%)
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="studied_credits">
                        <BookOpen size={16} />
                        Studied Credits
                    </label>
                    <input
                        id="studied_credits"
                        type="number"
                        name="studied_credits"
                        value={formData.studied_credits}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="Total credits"
                        aria-describedby="studied_credits_hint"
                    />
                    <span id="studied_credits_hint" className="input-hint">
                        Course credits enrolled
                    </span>
                </div>
            </div>
        </>
    );
}