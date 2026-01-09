import { Sliders } from 'lucide-react';

export function ScenarioIntro() {
    return (
        <div className="scenario-intro">
            <Sliders size={32} className="scenario-icon" />
            <p>
                Adjust student metrics below to explore how different interventions might impact risk levels.
                This simulation helps identify which factors have the greatest influence on student outcomes.
            </p>
        </div>
    );
}
