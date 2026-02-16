import EngagementOverview from '@/pages/EngagementOverview';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/engagement-overview')({
  component: EngagementOverview,
});
