"use client";

import React, { useState, useMemo } from "react";
import {
  PropertyListing,
  PropertyType,
  PropertyStatus,
} from "@/types/property";
import { usePropertyListings } from "@/hooks/usePropertyListings";
import { useAuth, useNavigation } from "@/hooks";
import {
  PropertyCard,
  PropertyFilters,
  PropertyGridSkeleton,
  PropertyDetailsSheet,
} from "@/components/feature/property";
import { Home, Search, Settings2 } from "lucide-react";
import { Button, Input, NavigationDrawer } from "@/components/shared";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Filters {
  search: string;
  type: PropertyType | "all";
  status: PropertyStatus | "all";
  minPrice: string;
  maxPrice: string;
}

export default function PropertyPage() {
  const { userRole } = useAuth();
  const { navigationItems } = useNavigation(userRole);
  const { properties, loading } = usePropertyListings();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
  });

  const [selectedProperty, setSelectedProperty] =
    useState<PropertyListing | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

      const minPrice =
        filters.minPrice && filters.minPrice !== ""
          ? parseInt(filters.minPrice)
          : null;
      const maxPrice =
        filters.maxPrice && filters.maxPrice !== ""
          ? parseInt(filters.maxPrice)
          : null;

      if (minPrice !== null && property.price < minPrice) {
        return false;
      }

      if (maxPrice !== null && property.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const handlePropertyClick = (property: PropertyListing) => {
    setSelectedProperty(property);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <div className="relative border-b mb-2">
        <div className="flex items-center py-4 px-4">
          <NavigationDrawer items={navigationItems} title="Main Menu" />

          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Property Listing App
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-1 lg:hidden px-4">
        <Input
          placeholder="Search"
          leftIcon={<Search className="w-6 h-6" />}
          className="rounded-full py-6 flex-1"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full p-6 bg-black w-16 flex-shrink-0">
              <Settings2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <PropertyFilters
              filters={filters}
              onFilterChange={setFilters}
              properties={properties}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className={`lg:w-80 lg:flex-shrink-0 hidden lg:block`}>
            <div className="sticky top-8">
              <PropertyFilters
                filters={filters}
                onFilterChange={setFilters}
                properties={properties}
              />
            </div>
          </div>

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

      <PropertyDetailsSheet
        property={selectedProperty}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
}
