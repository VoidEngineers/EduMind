import { type FieldError, type UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    name: string;
    options: SelectOption[];
    placeholder?: string;
    error?: FieldError;
    register: UseFormRegister<any>;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    onValueChange?: (value: string) => void;
}

/**
 * Reusable select field component with React Hook Form integration
 */
export function FormSelect({
    label,
    name,
    options,
    placeholder = 'Select an option',
    error,
    required = false,
    disabled = false,
    helperText,
    onValueChange,
}: FormSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Select
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    id={name}
                    className={error ? 'border-destructive focus:ring-destructive' : ''}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

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
