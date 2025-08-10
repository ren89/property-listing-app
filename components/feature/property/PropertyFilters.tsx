"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  PropertyType,
  PropertyStatus,
  PropertyListing,
} from "@/types/property";
import { Select, Input } from "@/components/shared";
import { Search, Filter, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatPriceCompact } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

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
  properties?: PropertyListing[];
}

export function PropertyFilters({
  onFilterChange,
  filters,
  properties = [],
}: PropertyFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const priceRange = useMemo(() => {
    if (properties.length === 0) {
      return { min: 0, max: 1000000 };
    }

    const prices = properties.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const padding = (maxPrice - minPrice) * 0.1;
    const range = {
      min: Math.floor(Math.max(minPrice * 0.9, minPrice - padding)), // Min with padding
      max: Math.ceil(maxPrice + padding),
    };
    return range;
  }, [properties]);

  const [sliderValues, setSliderValues] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);

  useEffect(() => {
    const minValue =
      filters.minPrice && filters.minPrice !== ""
        ? parseInt(filters.minPrice)
        : priceRange.min;
    const maxValue =
      filters.maxPrice && filters.maxPrice !== ""
        ? parseInt(filters.maxPrice)
        : priceRange.max;
    setSliderValues([minValue, maxValue]);
  }, [filters.minPrice, filters.maxPrice, priceRange.min, priceRange.max]);

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values;
    setSliderValues([min, max]);
    handleFilterChange("maxPrice", max.toString());
    handleFilterChange("minPrice", min.toString());
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
      <div className="w-full hidden md:block">
        <Input
          name="search"
          type="text"
          placeholder="Search properties by title or location..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          label=""
          className="rounded-full py-2 flex-1"
        />
      </div>

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

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
            Price Range
          </label>

          <div className="px-2 mt-2">
            <Slider
              value={sliderValues}
              onValueChange={handleSliderChange}
              min={priceRange.min}
              max={priceRange.max}
              step={Math.max(
                1000,
                Math.floor((priceRange.max - priceRange.min) / 100)
              )}
              className="w-full"
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Min: {formatPriceCompact(sliderValues[0])}</span>
            <span>Max: {formatPriceCompact(sliderValues[1])}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
