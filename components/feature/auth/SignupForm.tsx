"use client";

import React, { useState } from "react";
import { Input, Button } from "@/components/shared";
import { validateSignupForm } from "@/utils/validation";

interface SignupFormProps {
  onSubmit?: (
    name: string,
    email: string,
    password: string
  ) => Promise<void> | void;
  className?: string;
  showTitle?: boolean;
}

export default function SignupForm({ onSubmit, className }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const validation = validateSignupForm(name, email, password);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(name, email, password);
      }
    } catch (error) {
      setErrors({
        email: error instanceof Error ? error.message : "Signup failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className || ""}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Enter your full name"
          required
        />

        <Input
          name="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <Input
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          loadingText="Creating account..."
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}
