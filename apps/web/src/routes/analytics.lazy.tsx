import { Navbar } from '@/components/landing/Navbar';
import XAIPrediction from '@/components/xai_predictor/XAIPredictor';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/analytics')({
    component: () => (
        <>
            <Navbar />
            <XAIPrediction />
        </>
    ),
});
