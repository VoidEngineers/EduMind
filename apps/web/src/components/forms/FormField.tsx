import { type FieldError, type UseFormRegister } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'number' | 'email' | 'password';
    placeholder?: string;
    error?: FieldError;
    register: UseFormRegister<any>;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    helperText?: string;
}

/**
 * Reusable form field component with React Hook Form integration
 */
export function FormField({
    label,
    name,
    type = 'text',
    placeholder,
    error,
    register,
    required = false,
    min,
    max,
    step,
    disabled = false,
    helperText,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register(name, {
                    valueAsNumber: type === 'number',
                    min,
                    max,
                })}
                step={step}
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
