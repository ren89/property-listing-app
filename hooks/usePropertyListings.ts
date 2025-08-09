"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { PropertyListing } from "@/types/property";

export function usePropertyListings() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching properties:", error);
        } else {
          setProperties(data || []);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return { properties, loading };
}

export async function getPropertyById(
  id: string
): Promise<PropertyListing | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}
