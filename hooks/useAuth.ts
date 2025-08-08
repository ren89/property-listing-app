import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { login, logout, signup } from "@/app/actions";
import { createUser, getUserById } from "@/app/actions/users";
import type { User } from "@supabase/supabase-js";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleSignup = async (
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Create user profile after successful authentication (only if it doesn't exist)
      if (event === "SIGNED_IN" && session?.user) {
        try {
          // Check if user profile already exists
          const existingUser = await getUserById(session.user.id);
          // Only create profile if it doesn't exist
          if (!existingUser) {
            const userData = session.user.user_metadata;
            await createUser({
              id: session.user.id,
              email: session.user.email!,
              name:
                userData?.full_name || userData?.name || session.user.email!,
            });
          }
        } catch (error) {
          console.log("Error handling user profile:", error);
        }
      }

      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, handleLogin, handleSignup, handleLogout]);
  // NOTES: handleLogin, handleSignup and handleLogout are wrapped in useEffect to instantly update isAuthenticated

  return {
    user,
    loading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
}
