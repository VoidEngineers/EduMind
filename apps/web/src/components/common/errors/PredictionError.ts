/**
 * Custom Error Types for Predictors
 * Provides better error classification and handling
 */

export enum PredictionErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    SERVICE_ERROR = 'SERVICE_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class PredictionError extends Error {
    constructor(
        message: string,
        public type: PredictionErrorType,
        public details?: Record<string, unknown>,
        public recoverable: boolean = true
    ) {
        super(message);
        this.name = 'PredictionError';
        Object.setPrototypeOf(this, PredictionError.prototype);
    }

    getUserMessage(): string {
        switch (this.type) {
            case PredictionErrorType.VALIDATION_ERROR:
                return 'Please check your input and try again.';
            case PredictionErrorType.NETWORK_ERROR:
                return 'Unable to connect. Please check your internet connection.';
            case PredictionErrorType.SERVICE_ERROR:
                return 'The prediction service is temporarily unavailable. Please try again later.';
            case PredictionErrorType.TIMEOUT_ERROR:
                return 'The request took too long. Please try again.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }

    isRecoverable(): boolean {
        return this.recoverable;
    }
}

export class ValidationError extends PredictionError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, PredictionErrorType.VALIDATION_ERROR, details, true);
        this.name = 'ValidationError';
    }
}

export class NetworkError extends PredictionError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, PredictionErrorType.NETWORK_ERROR, details, true);
        this.name = 'NetworkError';
    }
}

export class ServiceError extends PredictionError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, PredictionErrorType.SERVICE_ERROR, details, true);
        this.name = 'ServiceError';
    }
}

export class TimeoutError extends PredictionError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, PredictionErrorType.TIMEOUT_ERROR, details, true);
        this.name = 'TimeoutError';
    }
}
