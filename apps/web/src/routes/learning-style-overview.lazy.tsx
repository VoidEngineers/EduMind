import LearningStyleOverview from '@/pages/LearningStyleOverview';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/learning-style-overview')({
    component: LearningStyleOverview,
});
