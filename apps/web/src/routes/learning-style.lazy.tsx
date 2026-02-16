import LearningStylePredictor from '@/components/Learning-style-predictor/LearningStylePredictor';
import { Navbar } from '@/components/landing/Navbar';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/learning-style')({
    component: () => (
        <>
            <Navbar />
            <LearningStylePredictor />
        </>
    ),
});
