"use client";

import React from "react";
import { PropertyType, PropertyStatus } from "@/types/property";
import { Select, Input, Button } from "@/components/shared";
import { Search, Filter, X } from "lucide-react";

interface PropertyFiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: PropertyType | "all";
    status: PropertyStatus | "all";
    minPrice: string;
    maxPrice: string;
  }) => void;
  filters: {
    search: string;
    type: PropertyType | "all";
    status: PropertyStatus | "all";
    minPrice: string;
    maxPrice: string;
  };
}

export function PropertyFilters({
  onFilterChange,
  filters,
}: PropertyFiltersProps) {
  // TODO: Improve filter ui in mobile view
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      type: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border w-full">
      <div className="w-full">
        <Input
          name="search"
          type="text"
          placeholder="Search properties by title or location..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          label=""
        />
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <Select
          name="type"
          label="Type"
          placeholder="All Types"
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
          options={[
            { value: "all", label: "All Types" },
            { value: PropertyType.House, label: "House" },
            { value: PropertyType.Apartment, label: "Apartment" },
            { value: PropertyType.Commercial, label: "Commercial" },
          ]}
        />

        <Select
          name="status"
          label="Status"
          placeholder="All Status"
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
          options={[
            { value: "all", label: "All Status" },
            { value: PropertyStatus.ForRent, label: "For Rent" },
            { value: PropertyStatus.ForSale, label: "For Sale" },
          ]}
        />

        <Input
          name="minPrice"
          label="Min Price"
          type="number"
          placeholder="0"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          className="w-full"
        />

        <Input
          name="maxPrice"
          label="Max Price"
          type="number"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}
