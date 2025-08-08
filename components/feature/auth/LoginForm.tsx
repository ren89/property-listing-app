"use client";

import React, { useState } from "react";
import { Card, Input, Button } from "@/components/shared";
import { validateLoginForm } from "@/utils/validation";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void> | void;
  className?: string;
  showTitle?: boolean;
}

export default function LoginForm({ onSubmit, className }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const validation = validateLoginForm(email, password);
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
        await onSubmit(email, password);
      }
    } catch (error) {
      setErrors({
        email: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className || ""}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          loadingText="Signing in..."
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
