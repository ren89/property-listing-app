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

    const { data: property } = await supabase
      .from("property_listings")
      .select("image")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("property_listings")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Delete associated images from storage
    if (property?.image && property.image.length > 0) {
      await deletePropertyImages(property.image);
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

export async function uploadPropertyImages(
  files: File[]
): Promise<{ urls: string[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { urls: null, error: "User not authenticated" };
    }

    const uploadPromises = files.map(async (file) => {
      // Generate unique filename
      const timestamp = new Date().getTime();
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from("pla-prod")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("pla-prod").getPublicUrl(filePath);

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);
    return { urls, error: null };
  } catch (error) {
    return {
      urls: null,
      error: error instanceof Error ? error.message : "Failed to upload images",
    };
  }
}

export async function deletePropertyImages(
  imageUrls: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const filePaths = imageUrls
      .map((url) => {
        const urlParts = url.split("/");
        const bucketIndex = urlParts.findIndex((part) => part === "pla-prod");
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          return urlParts.slice(bucketIndex + 1).join("/");
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length === 0) {
      return { success: false, error: "No valid file paths found" };
    }

    const { error } = await supabase.storage.from("pla-prod").remove(filePaths);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete images",
    };
  }
}
