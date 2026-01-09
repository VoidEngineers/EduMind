import { Activity, AlertTriangle, Calendar, Clock, TrendingDown } from 'lucide-react';
import type { HistoricalDataSectionProps } from './types';

export function HistoricalDataSection({ formData, onInputChange, onSelectChange }: HistoricalDataSectionProps) {
    return (
        <>
            <div className="section-title">
                <Calendar size={20} />
                <span>Historical Data</span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="num_of_prev_attempts">
                        <AlertTriangle size={16} />
                        Previous Attempts
                    </label>
                    <input
                        id="num_of_prev_attempts"
                        type="number"
                        name="num_of_prev_attempts"
                        value={formData.num_of_prev_attempts}
                        onChange={onInputChange}
                        min="0"
                        required
                        placeholder="0"
                        aria-describedby="prev_attempts_hint"
                    />
                    <span id="prev_attempts_hint" className="input-hint">
                        Number of retakes
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="low_performance">
                        <TrendingDown size={16} />
                        Low Performance Flag
                    </label>
                    <select
                        id="low_performance"
                        name="low_performance"
                        value={formData.low_performance}
                        onChange={(e) => onSelectChange('low_performance', parseInt(e.target.value))}
                        required
                        aria-describedby="low_performance_hint"
                    >
                        <option value={0}>No - Grade ≥ 40%</option>
                        <option value={1}>Yes - Grade &lt; 40%</option>
                    </select>
                    <span id="low_performance_hint" className="input-hint">
                        Below 40% threshold
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="low_engagement">
                        <Activity size={16} />
                        Low Engagement Flag
                    </label>
                    <select
                        id="low_engagement"
                        name="low_engagement"
                        value={formData.low_engagement}
                        onChange={(e) => onSelectChange('low_engagement', parseInt(e.target.value))}
                        required
                        aria-describedby="low_engagement_hint"
                    >
                        <option value={0}>No - Active participation</option>
                        <option value={1}>Yes - Limited participation</option>
                    </select>
                    <span id="low_engagement_hint" className="input-hint">
                        Low assessment completion
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="has_previous_attempts">
                        <Clock size={16} />
                        Has Previous Attempts
                    </label>
                    <select
                        id="has_previous_attempts"
                        name="has_previous_attempts"
                        value={formData.has_previous_attempts}
                        onChange={(e) => onSelectChange('has_previous_attempts', parseInt(e.target.value))}
                        required
                        aria-describedby="has_prev_attempts_hint"
                    >
                        <option value={0}>No - First attempt</option>
                        <option value={1}>Yes - Has retaken courses</option>
                    </select>
                    <span id="has_prev_attempts_hint" className="input-hint">
                        Failed courses previously
                    </span>
                </div>
            </div>
        </>
    );
}