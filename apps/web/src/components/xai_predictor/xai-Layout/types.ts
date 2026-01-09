export type LayoutProps = {
    theme: 'dark' | 'light';
    ariaAnnouncement: string;
    toast: { show: boolean; type: string; message: string };
    onToggleTheme: () => void;
    children: React.ReactNode;
}

export type ErrorDisplayProps = {
    error: Error | null;
}