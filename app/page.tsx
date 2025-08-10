"use client";

import LoginForm from "@/components/feature/auth/LoginForm";
import Image from "next/image";
import { useState } from "react";
import Sheet from "@/components/shared/Sheet";
import { useAuth } from "@/hooks";
import SignupForm from "@/components/feature/auth/SignupForm";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, loading, login, signup, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => setAuthMode("login");
  const handleSignUpClick = () => setAuthMode("signup");

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleSignupSubmit = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await signup(name, email, password);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Background image for mobile */}
      <div className=" -z-10">
        <Image
          src="/loginbg.png"
          alt="Login Background"
          fill
          priority
          className="object-cover w-full h-full"
        />
      </div>

      {/* Header / Title */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow md:text-black">
          Property Listing App
        </h1>
      </div>

      {/* Bottom sheet area */}
      <div className="flex flex-col items-center w-full px-4 pb-4 gap-4 max-w-md mx-auto">
        <Sheet
          buttonText="Get Started"
          title={
            authMode === "login" ? "Login to Your Account" : "Create an Account"
          }
          description={
            authMode === "login"
              ? "Enter your credentials to access your property listings and manage your account."
              : "Sign up to start managing your property listings and create your account."
          }
        >
          {authMode === "login" ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              className="max-w-none mx-0"
              showTitle={false}
              onChangeFormMode={setAuthMode}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignupSubmit}
              className="max-w-none mx-0"
              showTitle={false}
              onChangeFormMode={setAuthMode}
            />
          )}
        </Sheet>
        <span className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Property Listing App
        </span>
      </div>
    </div>
  );
}
