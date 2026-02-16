import XAIRiskOverview from '@/pages/XAIRiskOverview';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/xai-risk-overview')({
    component: XAIRiskOverview,
});
