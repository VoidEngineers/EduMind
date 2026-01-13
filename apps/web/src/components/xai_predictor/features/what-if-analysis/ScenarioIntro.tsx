import { Sliders } from 'lucide-react';

export function ScenarioIntro() {
    return (
        <div className="bg-muted/30 p-4 rounded-lg flex gap-4 items-start border border-border/50">
            <div className="bg-cyan-100 p-2 rounded-full">
                <Sliders size={24} className="text-cyan-600" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Adjust student metrics below to explore how different interventions might impact risk levels.
                This simulation helps identify which factors have the greatest influence on student outcomes.
            </p>
        </div>
    );
}
