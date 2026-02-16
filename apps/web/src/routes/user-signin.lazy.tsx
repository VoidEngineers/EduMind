import UserSignin from '@/components/User-Signin/UserSignin';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/user-signin')({
    component: UserSignin,
});
