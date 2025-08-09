"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { PropertyListing } from "@/types/property";

export function usePropertyListings() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setProperties(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("property_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProperties(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, refetch };
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
