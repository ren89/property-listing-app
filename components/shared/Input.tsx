import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export default function Input({
  type = "text",
  name,
  required = true,
  label,
  error,
  ...props
}: InputProps) {
  const displayLabel =
    label || (name ? name.charAt(0).toUpperCase() + name.slice(1) : "");

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={name} className="text-sm font-medium">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <BaseInput
        name={name}
        type={type}
        id={name}
        required={required}
        className={`border rounded p-2 w-full ${
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <p 
          id={`${name}-error`} 
          className="text-sm text-red-500 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
