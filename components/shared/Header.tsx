"use client";

import { useState } from "react";
import { Button, Modal, Dropdown, Avatar } from "@/components/shared";
import LoginForm from "@/components/feature/auth/LoginForm";
import SignupForm from "@/components/feature/auth/SignupForm";
import { useAuth } from "@/hooks";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, loading, login, signup, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsAuthModalOpen(false);
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
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const dropdownItems = [
    {
      label: "Logout",
      onClick: handleLogout,
      className: "text-red-600 focus:text-red-600 cursor-pointer",
    },
  ];

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Property Listings
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Dropdown items={dropdownItems}>
                  <Avatar
                    fallback={user?.email?.charAt(0).toUpperCase() || "U"}
                    size="md"
                    className="cursor-pointer"
                  />
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleLoginClick}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        title={
          authMode === "login" ? "Login to Your Account" : "Create Your Account"
        }
        description={
          authMode === "login"
            ? "Enter your credentials to access your property listings and manage your account."
            : "Sign up to start managing your property listings and create your account."
        }
      >
        <div className="space-y-4">
          {authMode === "login" ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              className="max-w-none mx-0"
              showTitle={false}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignupSubmit}
              className="max-w-none mx-0"
              showTitle={false}
            />
          )}

          <div className="text-center border-t pt-4">
            <p className="text-sm text-gray-600">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <span
                onClick={() =>
                  setAuthMode(authMode === "login" ? "signup" : "login")
                }
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer focus:outline-none hover:underline"
              >
                {authMode === "login" ? "Sign up here" : "Login here"}
              </span>
            </p>
          </div>
        </div>
      </Modal>
    </header>
  );
}
