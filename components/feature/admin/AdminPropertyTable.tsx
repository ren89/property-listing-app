import Card from "@/components/shared/Card";
import {
  PropertyTable,
  DataTableSkeleton,
  createPropertyColumns,
} from "@/components/feature/admin";
import { PropertyListing } from "@/types/property";

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
  // Create update and delete action columns for the data table
  const columns = createPropertyColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Properties</h2>

      {loading ? (
        <DataTableSkeleton />
      ) : (
        <PropertyTable
          columns={columns}
          data={properties}
          searchPlaceholder="Search properties..."
          onAddProperty={onAddProperty}
        />
      )}
    </Card>
  );
}
