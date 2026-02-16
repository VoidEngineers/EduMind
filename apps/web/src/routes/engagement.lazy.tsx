import EngagementPredictor from '@/components/engagement-predictor/EngagementPredictor';
import { Navbar } from '@/components/landing/Navbar';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/engagement')({
    component: () => (
        <>
            <Navbar />
            <EngagementPredictor />
        </>
    ),
});
