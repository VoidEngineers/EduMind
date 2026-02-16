import AdminSignin from '@/components/Admin-Signin/AdminSignin';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin-signin')({
    component: AdminSignin,
});
