"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  PropertyListing,
  CreatePropertyListingData,
  UpdatePropertyListingData,
} from "@/types/property";

export async function createPropertyListing(
  data: CreatePropertyListingData
): Promise<{ data: PropertyListing | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: property, error } = await supabase
      .from("property_listings")
      .insert(data)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/properties");
    return { data: property, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updatePropertyListing(
  id: string,
  data: UpdatePropertyListingData
): Promise<{ data: PropertyListing | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: property, error } = await supabase
      .from("property_listings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath("/properties");
    return { data: property, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deletePropertyListing(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("property_listings")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/properties");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
