/**
 * Event Bus for Analytics and Side Effects
 * Enables loose coupling for cross-cutting concerns
 */

type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

export class EventBus {
    private handlers: Map<string, Set<EventHandler>> = new Map();

    /**
     * Subscribe to an event
     */
    on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }

        this.handlers.get(event)!.add(handler as EventHandler);

        // Return unsubscribe function
        return () => {
            this.handlers.get(event)?.delete(handler as EventHandler);
        };
    }

    /**
     * Emit an event
     */
    async emit<T = unknown>(event: string, data: T): Promise<void> {
        const handlers = this.handlers.get(event);
        if (!handlers) return;

        const promises = Array.from(handlers).map(handler =>
            Promise.resolve(handler(data))
        );

        await Promise.allSettled(promises);
    }

    /**
     * Remove all handlers for an event
     */
    off(event: string): void {
        this.handlers.delete(event);
    }

    /**
     * Clear all handlers
     */
    clear(): void {
        this.handlers.clear();
    }
}

// Singleton instance
export const eventBus = new EventBus();

// Prediction Events
export const PREDICTION_EVENTS = {
    STARTED: 'prediction.started',
    VALIDATING: 'prediction.validating',
    SUBMITTING: 'prediction.submitting',
    SUCCESS: 'prediction.success',
    ERROR: 'prediction.error',
    RESET: 'prediction.reset',
} as const;

// Event payload types
export interface PredictionStartedEvent {
    type: 'learning-style' | 'engagement' | 'xai';
    timestamp: string;
    studentId?: string;
}

export interface PredictionSuccessEvent extends PredictionStartedEvent {
    duration: number; // milliseconds
    resultId?: string;
}

export interface PredictionErrorEvent extends PredictionStartedEvent {
    error: Error;
    duration: number;
}
