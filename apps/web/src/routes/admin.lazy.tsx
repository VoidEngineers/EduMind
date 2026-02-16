import AdminApp from '@/components/Admin-App/AdminApp';
import { Navbar } from '@/components/landing/Navbar';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin')({
  component: () => (
    <>
      <Navbar />
      <AdminApp />
    </>
  ),
});
