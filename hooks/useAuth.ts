import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { login, logout, signup } from "@/app/actions";
import { createUser, getUserById } from "@/app/actions/users";
import type { User } from "@supabase/supabase-js";

export interface UseAuthReturn {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);

      const { data } = await supabase.auth.getClaims();
      const userRole = data?.claims.user_role;

      if (userRole === "Admin") {
        router.push("/admin");
      } else {
        router.push("/property");
      }
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
      
      // Get user role from claims if user is authenticated
      if (user) {
        try {
          const { data } = await supabase.auth.getClaims();
          setUserRole(data?.claims.user_role || null);
        } catch (error) {
          console.error("Failed to get user claims:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
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
      
      // Get user role from claims when auth state changes
      if (session?.user) {
        try {
          const { data } = await supabase.auth.getClaims();
          setUserRole(data?.claims.user_role || null);
        } catch (error) {
          console.error("Failed to get user claims:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, handleLogin, handleSignup, handleLogout]);
  // NOTES: handleLogin, handleSignup and handleLogout are wrapped in useEffect to instantly update isAuthenticated

  return {
    user,
    userRole,
    loading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
}
