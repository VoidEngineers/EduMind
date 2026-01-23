import { type FieldError, type UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/label';

interface FormTextareaProps {
    label: string;
    name: string;
    placeholder?: string;
    error?: FieldError;
    register: UseFormRegister<any>;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    disabled?: boolean;
    helperText?: string;
}

/**
 * Reusable textarea field component with React Hook Form integration
 */
export function FormTextarea({
    label,
    name,
    placeholder,
    error,
    register,
    required = false,
    rows = 4,
    maxLength,
    disabled = false,
    helperText,
}: FormTextareaProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <textarea
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                {...register(name)}
            />

            {helperText && !error && (
                <p id={`${name}-helper`} className="text-xs text-muted-foreground">
                    {helperText}
                </p>
            )}

            {error && (
                <p
                    id={`${name}-error`}
                    className="text-xs text-destructive font-medium"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}
