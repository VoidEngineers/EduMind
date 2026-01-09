/**
 * Custom Error class for XAI-related errors
 * Provides better error context and user-friendly messages
 */
export class XAIError extends Error {
    public readonly statusCode?: number;
    public readonly details?: unknown;
    public readonly userMessage: string;

    constructor(
        message: string,
        options?: {
            statusCode?: number;
            details?: unknown;
            userMessage?: string;
        }
    ) {
        super(message);
        this.name = 'XAIError';
        this.statusCode = options?.statusCode;
        this.details = options?.details;
        this.userMessage = options?.userMessage || this.getDefaultUserMessage();

        // Maintains proper stack trace for where our error was thrown (V8 environments)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, XAIError);
        }
    }

    /**
     * Get user-friendly error message based on status code
     */
    private getDefaultUserMessage(): string {
        if (!this.statusCode) {
            return 'An unexpected error occurred. Please try again.';
        }

        switch (this.statusCode) {
            case 400:
                return 'Invalid student data provided. Please check your inputs.';
            case 404:
                return 'The requested resource was not found.';
            case 500:
                return 'The prediction service is experiencing issues. Please try again later.';
            case 503:
                return 'The prediction model is currently unavailable. Please try again later.';
            default:
                if (this.statusCode >= 500) {
                    return 'Server error occurred. Please try again later.';
                }
                return 'An error occurred. Please try again.';
        }
    }

    /**
     * Check if error is a network error
     */
    static isNetworkError(error: unknown): boolean {
        return error instanceof TypeError && error.message.includes('fetch');
    }

    /**
     * Create XAIError from unknown error
     */
    static fromUnknown(error: unknown): XAIError {
        if (error instanceof XAIError) {
            return error;
        }

        if (error instanceof Error) {
            if (XAIError.isNetworkError(error)) {
                return new XAIError('Network error', {
                    statusCode: 0,
                    details: error,
                    userMessage: 'Unable to connect to the prediction service. Please check your internet connection.',
                });
            }

            return new XAIError(error.message, {
                details: error,
            });
        }

        return new XAIError('Unknown error occurred', {
            details: error,
        });
    }
}
