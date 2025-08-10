"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchColumn?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyMessage?: string;
  filteredEmptyMessage?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  showColumnVisibility?: boolean;
  showPagination?: boolean;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  searchColumn,
  searchValue,
  onSearchChange,
  emptyMessage = "No data available.",
  filteredEmptyMessage = "No results match the current filters.",
  hasActiveFilters = false,
  onClearFilters,
  showColumnVisibility = true,
  showPagination = true,
  className = "",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Sync search value with column filter
  React.useEffect(() => {
    if (searchColumn && searchValue !== undefined) {
      table.getColumn(searchColumn)?.setFilterValue(searchValue);
    }
  }, [searchColumn, searchValue, table]);

  // Notify parent of column filter changes for search
  React.useEffect(() => {
    if (searchColumn && onSearchChange) {
      const columnFilterValue = table
        .getColumn(searchColumn)
        ?.getFilterValue() as string;
      if (columnFilterValue !== searchValue) {
        onSearchChange(columnFilterValue || "");
      }
    }
  }, [columnFilters, searchColumn, onSearchChange, searchValue, table]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Column Visibility Control */}
      {showColumnVisibility && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {data.length === 0 ? (
                      emptyMessage
                    ) : hasActiveFilters ? (
                      <div className="space-y-2">
                        <p>{filteredEmptyMessage}</p>
                        {onClearFilters && (
                          <Button
                            variant="outline"
                            onClick={onClearFilters}
                            size="sm"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    ) : (
                      "No results."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {table.getFilteredRowModel().rows.length}{" "}
            {table.getFilteredRowModel().rows.length === 1 ? "item" : "items"}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="whitespace-nowrap"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="whitespace-nowrap"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the table instance type for advanced use cases
export type { TanStackTable as TableInstance };
