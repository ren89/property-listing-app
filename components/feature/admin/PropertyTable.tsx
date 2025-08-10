"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Banknote, Plus } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Select from "@/components/shared/Select";
import {
  PropertyListing,
  PropertyStatus,
  PropertyType,
} from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertyTableProps {
  columns: ColumnDef<PropertyListing>[];
  data: PropertyListing[];
  searchPlaceholder?: string;
  onAddProperty: () => void;
}

export function PropertyTable({
  columns,
  data,
  searchPlaceholder = "Search properties...",
  onAddProperty,
}: PropertyTableProps) {
  const [statusFilter, setStatusFilter] = React.useState<
    PropertyStatus | "all"
  >("all");
  const [typeFilter, setTypeFilter] = React.useState<PropertyType | "all">(
    "all"
  );
  const [isPriceFilterActive, setIsPriceFilterActive] = React.useState(false);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Calculate min and max prices from the data
  const priceRange_minMax = React.useMemo(() => {
    if (data.length === 0) return { min: 0, max: 1000000 };

    const prices = data.map((property) => property.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }, [data]);

  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    priceRange_minMax.min,
    priceRange_minMax.max,
  ]);
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>([
    priceRange_minMax.min,
    priceRange_minMax.max,
  ]);

  // Update price ranges when data changes
  React.useEffect(() => {
    setPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setTempPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setIsPriceFilterActive(false);
  }, [priceRange_minMax.min, priceRange_minMax.max]);

  // Filter data based on status, type, and search filters
  const filteredData = React.useMemo(() => {
    return data.filter((property) => {
      const matchesStatus =
        statusFilter === "all" || property.status === statusFilter;
      const matchesType =
        typeFilter === "all" || property.property_type === typeFilter;
      const matchesPrice =
        !isPriceFilterActive ||
        (property.price >= priceRange[0] && property.price <= priceRange[1]);
      const matchesSearch =
        searchValue === "" ||
        property.title.toLowerCase().includes(searchValue.toLowerCase());
      return matchesStatus && matchesType && matchesPrice && matchesSearch;
    });
  }, [
    data,
    statusFilter,
    typeFilter,
    priceRange,
    isPriceFilterActive,
    searchValue,
  ]);

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setTempPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setIsPriceFilterActive(false);
    setSearchValue("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    isPriceFilterActive ||
    searchValue.length > 0;

  const handlePriceRangeChange = (values: number[]) => {
    setTempPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    setIsPriceFilterActive(true);
    setIsPricePopoverOpen(false);
  };

  const clearPriceFilter = () => {
    setPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setTempPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setIsPriceFilterActive(false);
    setIsPricePopoverOpen(false);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₱${(price / 1000).toFixed(0)}K`;
    }
    return `₱${price.toLocaleString()}`;
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: PropertyStatus.ForRent, label: "For Rent" },
    { value: PropertyStatus.ForSale, label: "For Sale" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: PropertyType.Apartment, label: "Apartment" },
    { value: PropertyType.House, label: "House" },
    { value: PropertyType.Commercial, label: "Commercial" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        {/* Search Input */}
        <div className="w-full lg:flex-1 lg:max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-row gap-4 sm:items-end">
          <div className="w-full sm:min-w-[140px]">
            <Select
              name="status"
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as PropertyStatus | "all")
              }
              placeholder="Select status"
            />
          </div>

          <div className="w-full sm:min-w-[140px]">
            <Select
              name="type"
              label="Type"
              options={typeOptions}
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as PropertyType | "all")
              }
              placeholder="Select type"
            />
          </div>

          <div className="w-full sm:min-w-[140px]">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Popover
                open={isPricePopoverOpen}
                onOpenChange={setIsPricePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between ${
                      isPriceFilterActive ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 font-normal ">
                      <Banknote className="h-4 w-4" />
                      {isPriceFilterActive
                        ? `${formatPrice(priceRange[0])} - ${formatPrice(
                            priceRange[1]
                          )}`
                        : "Any Price"}
                    </div>
                    <ChevronDown
                      className="h-4 w-4 text-gray-400"
                      strokeWidth={2}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <div className="px-3">
                        <Slider
                          value={tempPriceRange}
                          onValueChange={handlePriceRangeChange}
                          max={priceRange_minMax.max}
                          min={priceRange_minMax.min}
                          step={Math.max(
                            1000,
                            Math.floor(
                              (priceRange_minMax.max - priceRange_minMax.min) /
                                100
                            )
                          )}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{formatPrice(tempPriceRange[0])}</span>
                        <span>{formatPrice(tempPriceRange[1])}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={applyPriceFilter}
                        size="sm"
                        className="flex-1"
                      >
                        Apply
                      </Button>
                      <Button
                        onClick={clearPriceFilter}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Clear Filters Button - Part of the filter row 
          Removed for simplicity, can be added back if needed
          */}
          {/* {hasActiveFilters && (
            <div className="w-full sm:w-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Action</label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )} */}
          <div className="flex-1" />
          <Button
            onClick={onAddProperty}
            className="flex items-center gap-2 self-end"
          >
            <Plus size={16} />
            Add New Property
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="whitespace-nowrap">
            Showing {filteredData.length} of {data.length} properties
          </span>
          {statusFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
              {statusFilter === PropertyStatus.ForRent
                ? "For Rent"
                : "For Sale"}
            </span>
          )}
          {typeFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
              {typeFilter}
            </span>
          )}
          {isPriceFilterActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        emptyMessage="No properties found. Create your first property listing!"
        filteredEmptyMessage="No properties match the current filters."
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        showColumnVisibility={false}
        showPagination
      />
    </div>
  );
}
