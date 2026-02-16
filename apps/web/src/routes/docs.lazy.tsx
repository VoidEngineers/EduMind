import Docs from '@/pages/Docs';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/docs')({
    component: Docs,
});
