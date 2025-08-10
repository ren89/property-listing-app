import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  type = "text",
  name,
  required = false,
  label,
  error,
  leftIcon,
  rightIcon,
  className,
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
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <BaseInput
          name={name}
          type={type}
          id={name}
          required={required}
          className={[
            "w-full rounded-lg border px-5 py-7 text-base sm:text-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-all duration-200",
            "placeholder:text-gray-400",
            "min-h-[48px] sm:min-h-[56px]",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {rightIcon}
          </div>
        )}
      </div>
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
