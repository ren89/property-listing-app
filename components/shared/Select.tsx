import React from "react"
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  name: string
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export default function Select({
  name,
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  error,
  required = false,
  disabled = false,
}: SelectProps) {
  const displayLabel = label || (name ? name.charAt(0).toUpperCase() + name.slice(1) : "")

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={name} className="text-sm font-medium">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <BaseSelect
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full ${
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
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
      </BaseSelect>
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
  )
}
