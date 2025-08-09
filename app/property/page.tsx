"use client";

import React, { useState, useMemo } from "react";
import {
  PropertyListing,
  PropertyType,
  PropertyStatus,
} from "@/types/property";
import { usePropertyListings } from "@/hooks/usePropertyListings";
import {
  PropertyCard,
  PropertyFilters,
  PropertyGridSkeleton,
} from "@/components/feature/property";
import { Button } from "@/components/ui/button";
import { Home, Filter } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Filters {
  search: string;
  type: PropertyType | "all";
  status: PropertyStatus | "all";
  minPrice: string;
  maxPrice: string;
}

export default function PropertyPage() {
  const { properties, loading } = usePropertyListings();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
  });

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(searchTerm);
        const matchesLocation = property.location
          .toLowerCase()
          .includes(searchTerm);
        const matchesDescription = property.description
          .toLowerCase()
          .includes(searchTerm);

        if (!matchesTitle && !matchesLocation && !matchesDescription) {
          return false;
        }
      }

      if (filters.type !== "all" && property.property_type !== filters.type) {
        return false;
      }

      if (filters.status !== "all" && property.status !== filters.status) {
        return false;
      }

      if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const handlePropertyClick = (property: PropertyListing) => {
    toast.info(`Clicked on ${property.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Property Listings
              </h1>
              {loading ? (
                <Skeleton className="h-4 w-1/2 mt-1" />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredProperties.length} properties available
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 lg:flex-shrink-0 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="sticky top-8">
              <PropertyFilters filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <PropertyGridSkeleton />
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Home className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {properties.length === 0
                    ? "There are no properties listed yet."
                    : "Try adjusting your filters to find more properties."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
