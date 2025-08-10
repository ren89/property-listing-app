"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import {
  PropertyListing,
  PropertyType,
  PropertyStatus,
} from "@/types/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
interface PropertyColumnsProps {
  onEdit: (property: PropertyListing) => void;
  onDelete: (property: PropertyListing) => void;
}

export const createPropertyColumns = ({
  onEdit,
  onDelete,
}: PropertyColumnsProps): ColumnDef<PropertyListing>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="min-w-[200px]">
          <div className="font-medium text-gray-900">{property.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {property.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start"
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium text-gray-900">{formatted}</div>;
    },
  },
  {
    accessorKey: "property_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("property_type") as PropertyType;
      const colors = {
        [PropertyType.Apartment]: "bg-purple-100 text-purple-800",
        [PropertyType.House]: "bg-orange-100 text-orange-800",
        [PropertyType.Commercial]: "bg-gray-100 text-gray-800",
      };
      return <Badge className={`${colors[type]} border-0`}>{type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as PropertyStatus;
      const color =
        status === PropertyStatus.ForRent
          ? "bg-green-100 text-green-800"
          : "bg-blue-100 text-blue-800";
      return (
        <Badge className={`${color} border-0`}>
          {status === PropertyStatus.ForRent ? "For Rent" : "For Sale"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-left justify-start"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-gray-600">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const property = row.original;
      return (
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
      );
    },
  },
];
