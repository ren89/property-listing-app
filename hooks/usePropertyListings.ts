"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { PropertyListing } from "@/types/property";

export function usePropertyListings() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const refetch = () => {
    fetchProperties();
  };

  // Optimistic update functions for better UX
  const addPropertyOptimistically = (property: PropertyListing) => {
    setProperties((prev) => [property, ...prev]);
  };

  const updatePropertyOptimistically = (
    id: string,
    updatedProperty: Partial<PropertyListing>
  ) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id ? { ...prop, ...updatedProperty } : prop
      )
    );
  };

  const removePropertyOptimistically = (id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
  };

  return {
    properties,
    loading,
    refetch,
    addPropertyOptimistically,
    updatePropertyOptimistically,
    removePropertyOptimistically,
  };
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
