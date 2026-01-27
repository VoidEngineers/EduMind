import { Navbar } from '@/components/landing/Navbar';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ErrorDisplayProps, LayoutProps } from './types';

/**
 * Main layout wrapper with header, theme toggle, and toast
 */
export function XAILayout({ theme, ariaAnnouncement, toast, children }: LayoutProps) {
    return (
        <div className={`min-h-screen bg-background ${theme}`}>
            {/* ARIA live region */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {ariaAnnouncement}
            </div>


            {/* Theme Toggle - Removed for forced light mode */}


            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed top-24 right-4 z-[100] flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' :
                        toast.type === 'error' ? 'bg-destructive text-destructive-foreground' :
                            'bg-blue-600 text-white'
                        }`}
                    role="alert"
                    aria-live="assertive"
                >
                    <CheckCircle size={18} />
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

            {/* Navbar */}
            <Navbar />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative z-20">
                {children}
            </div>
        </div>
    );
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
    if (!error) return null;

    return (
        <div className="flex items-center gap-3 bg-destructive/10 border-2 border-destructive text-destructive px-5 py-4 rounded-lg font-semibold mb-6" role="alert">
            <AlertCircle size={20} />
            {error instanceof Error ? error.message : 'An error occurred'}
        </div>
    );
}
