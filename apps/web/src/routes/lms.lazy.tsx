import { Navbar } from '@/components/landing/Navbar';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/lms')({
    component: () => (
        <>
            <Navbar />
            {/* LMS Component Placeholder */}
        </>
    ),
});
