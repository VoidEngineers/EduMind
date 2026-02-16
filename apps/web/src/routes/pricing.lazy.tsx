import Pricing from '@/pages/Pricing';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/pricing')({
    component: Pricing,
});
