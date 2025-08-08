"use client";

import { useState } from "react";
import { Button, Modal, Dropdown, Avatar } from "@/components/shared";
import LoginForm from "@/components/feature/auth/LoginForm";
import { useAuth } from "@/hooks";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, loading, login, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
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
                <Dropdown
                  items={[
                    {
                      label: "Logout",
                      onClick: handleLogout,
                      className:
                        "text-red-600 focus:text-red-600 cursor-pointer",
                    },
                  ]}
                >
                  <Avatar
                    fallback={user?.email?.charAt(0).toUpperCase() || "U"}
                    size="md"
                    className="cursor-pointer"
                  />
                </Dropdown>
              </div>
            ) : (
              <Button onClick={handleLoginClick}>Login</Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        title="Login to Your Account"
        description="Enter your credentials to access your property listings and manage your account."
      >
        <LoginForm
          onSubmit={handleLoginSubmit}
          className="max-w-none mx-0"
          showTitle={false}
        />
      </Modal>
    </header>
  );
}
