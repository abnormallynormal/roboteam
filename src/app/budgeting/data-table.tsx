"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
const category = [
  { label: "Parts Orders", value: "parts-orders" },
  { label: "Tournament Fees", value: "tournament" },
  { label: "Food", value: "food" },
  { label: "Sponsorships", value: "sponsors" },
  { label: "Grants", value: "grants" },
  { label: "Miscellaneous", value: "misc" },
];
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditableText from "@/components/ui/editable-text";
import FilterPopup from "./filter";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFiltersState = ColumnFilter[];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "date",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState([]);

  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const handleCheckboxChange = ({
    category,
    checked,
  }: {
    category: any;
    checked: boolean;
  }) => {
    console.log(checkedItems)
    console.log(checked)
    if (checked) {
      setCheckedItems((prev: any) => [...prev, category]);
    } else { 
      setCheckedItems((prev: any) => prev.filter((item: any) => item.value != category.value));
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="mb-4 ">
        <FilterPopup
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          categories={category}
          checkedBoxes={checkedItems}
          onCheckboxChangeAction={handleCheckboxChange}
        />
      </div>
      <div className="rounded-md border">
        <Table className="table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.column.id === "id") return null;
                  return (
                    <TableHead key={header.id}>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "id") return null;
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions"
                            ? "text-right py-2"
                            : "text-left py-2"
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
