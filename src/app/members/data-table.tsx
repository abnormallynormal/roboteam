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
  { label: "Parts Orders", value: "Parts Orders" },
  { label: "Tournament Fees", value: "Tournament Fees" },
  { label: "Food", value: "Food" },
  { label: "Sponsorships", value: "Sponsorships" },
  { label: "Grants", value: "Grants" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterPopup from "./filter";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onItemAdded?: (item: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onItemAdded,
}: DataTableProps<TData, TValue>) {
  
  const [columnFilters, setColumnFilters] = useState([]);
  const [type, setType] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const handleCheckedTypeChange = ({
    type,
    checked,
  }: {
    type: any;
    checked: boolean;
  }) => {
    if (checked) {
      setType(type);
    } else {
      setType(null);
    }
    console.log({ type });
  };
  const handleCheckboxChange = ({
    category,
    checked,
  }: {
    category: any;
    checked: boolean;
  }) => {
    console.log(checkedItems);
    console.log(checked);
    if (checked) {
      setCheckedItems((prev: any) => [...prev, category]);
    } else {
      setCheckedItems((prev: any) =>
        prev.filter((item: any) => item.value != category.value)
      );
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="mb-4 ">
        <FilterPopup
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-auto relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.column.id === "id") return null;
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.id === "actions"
                          ? "text-right py-2 sticky right-0 bg-gradient-to-l from-background from-70% to-transparent shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] z-10 pl-12"
                          : ""
                      }
                    >
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
                            ? "text-right py-2 sticky right-0 bg-gradient-to-l from-background from-70% to-transparent shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] z-10 pl-12"
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
