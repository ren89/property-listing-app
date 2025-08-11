import React, { useState, useMemo, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Banknote,
  ChevronDown,
} from "lucide-react";
import Card from "@/components/shared/Card";
import {
  PropertyListing,
  PropertyStatus,
  PropertyType,
} from "@/types/property";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Select from "@/components/shared/Select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableSkeleton } from "./DataTableSkeleton";

interface AdminPropertyTableProps {
  properties: PropertyListing[];
  loading: boolean;
  onEdit: (property: PropertyListing) => void;
  onDelete: (property: PropertyListing) => void;
  onAddProperty: () => void;
}

export function AdminPropertyTable({
  properties,
  loading,
  onEdit,
  onDelete,
  onAddProperty,
}: AdminPropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<PropertyType | "all">("all");
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);

  const priceRange_minMax = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 1000000 };

    const prices = properties.map((property) => property.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }, [properties]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceRange_minMax.min,
    priceRange_minMax.max,
  ]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    priceRange_minMax.min,
    priceRange_minMax.max,
  ]);

  useEffect(() => {
    setPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setTempPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setIsPriceFilterActive(false);
  }, [priceRange_minMax.min, priceRange_minMax.max]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        searchTerm === "" ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || property.status === statusFilter;

      const matchesType =
        typeFilter === "all" || property.property_type === typeFilter;

      const matchesPrice =
        !isPriceFilterActive ||
        (property.price >= priceRange[0] && property.price <= priceRange[1]);

      return matchesSearch && matchesStatus && matchesType && matchesPrice;
    });
  }, [
    properties,
    searchTerm,
    statusFilter,
    typeFilter,
    priceRange,
    isPriceFilterActive,
  ]);

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setTempPriceRange([priceRange_minMax.min, priceRange_minMax.max]);
    setIsPriceFilterActive(false);
    setSearchTerm("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    isPriceFilterActive ||
    searchTerm.length > 0;

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
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const formatPriceDisplay = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter options
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

  const getStatusBadge = (status: PropertyStatus) => {
    const color =
      status === PropertyStatus.ForRent
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800";

    return (
      <Badge className={`${color} border-0`}>
        {status === PropertyStatus.ForRent ? "For Rent" : "For Sale"}
      </Badge>
    );
  };

  const getTypeBadge = (type: PropertyType) => {
    const colors = {
      [PropertyType.Apartment]: "bg-purple-100 text-purple-800",
      [PropertyType.House]: "bg-orange-100 text-orange-800",
      [PropertyType.Commercial]: "bg-gray-100 text-gray-800",
    };

    return <Badge className={`${colors[type]} border-0`}>{type}</Badge>;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Properties</h2>
        <DataTableSkeleton />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Properties</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="w-full lg:flex-1 lg:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                      <div className="flex items-center gap-2 font-normal">
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
                                (priceRange_minMax.max -
                                  priceRange_minMax.min) /
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
          </div>
          <Button onClick={onAddProperty} className="flex items-center gap-2">
            <Plus size={16} />
            Add New Property
          </Button>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="whitespace-nowrap">
              Showing {filteredProperties.length} of {properties.length}{" "}
              properties
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
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {properties.length === 0
                    ? "No properties found. Create your first property listing!"
                    : "No properties match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="min-w-[200px]">
                      <div className="font-medium text-gray-900">
                        {property.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {property.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-700">{property.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {formatPriceDisplay(property.price)}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(property.property_type)}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell>
                    <div className="text-gray-600">
                      {formatDate(property.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(property)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        title="Delete Property"
                        description={`Are you sure you want to delete "${property.title}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => onDelete(property)}
                        isDestructive={true}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
