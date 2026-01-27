import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student';
    avatar?: string;
}

interface AppState {
    // Theme
    theme: 'light' | 'dark' | 'system';

    // Notifications
    notifications: Notification[];

    // User
    user: User | null;

    // Loading states
    isLoading: boolean;

    // Actions
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                theme: 'system',
                notifications: [],
                user: null,
                isLoading: false,

                // Actions
                setTheme: (theme) => set({ theme }, false, 'setTheme'),

                addNotification: (notification) =>
                    set(
                        (state) => ({
                            notifications: [
                                ...state.notifications,
                                { ...notification, id: crypto.randomUUID() },
                            ],
                        }),
                        false,
                        'addNotification'
                    ),

                removeNotification: (id) =>
                    set(
                        (state) => ({
                            notifications: state.notifications.filter((n) => n.id !== id),
                        }),
                        false,
                        'removeNotification'
                    ),

                clearNotifications: () =>
                    set({ notifications: [] }, false, 'clearNotifications'),

                setUser: (user) => set({ user }, false, 'setUser'),

                setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
            }),
            {
                name: 'app-storage',
                partialize: (state) => ({
                    theme: state.theme,
                    user: state.user,
                }),
            }
        ),
        { name: 'AppStore' }
    )
);
