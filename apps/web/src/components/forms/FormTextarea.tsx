import { type FieldError, type FieldValues, type Path, type UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/label';

interface FormTextareaProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    placeholder?: string;
    error?: FieldError;
    register: UseFormRegister<T>;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    disabled?: boolean;
    helperText?: string;
}

/**
 * Reusable textarea field component with React Hook Form integration
 */
export function FormTextarea<T extends FieldValues>({
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
}: FormTextareaProps<T>) {
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
                {...(error && { 'aria-invalid': true })}
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
