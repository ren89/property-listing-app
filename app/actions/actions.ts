"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Login failed");
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(name: string, email: string, password: string) {
  const supabase = await createClient();
  // NOTES: confirm email is disabled in Supabase settings for ease of testing
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Signup failed");
  }

  // Profile creation will happen in useAuth hook after successful authentication

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "Logout failed");
  }

  revalidatePath("/", "layout");
  redirect("/");
  return { success: true };
}
