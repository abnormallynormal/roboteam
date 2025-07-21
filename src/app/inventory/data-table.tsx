"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddItemForm from "@/components/add-item-form";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  collection: string;
  team: string;
  onItemAdded: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  collection,
  team,
  onItemAdded,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div>
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 mb-4">
          <div>
            <Input placeholder="Filter items by name" className=""></Input>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="my-2 text-sm">Category</div>
              <div className="flex flex-wrap gap-3">
                {[
                  "Metal",
                  "Wheels",
                  "Electronics",
                  "Gears/Sprockets",
                  "Pneumatics",
                  "Game Elements",
                ].map((team) => (
                  <div key={team} className="flex items-center gap-2">
                    <Checkbox id={`team-${team}`} />
                    <Label htmlFor={`team-${team}`}>{team}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus />
                Add item
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" avoidCollisions={true}>
              <AddItemForm
                collection={collection}
                team={team}
                onItemAdded={onItemAdded}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="rounded-md border w-[full]">
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
                            : "text-left py-0"
                        }
                        onDoubleClick={() => {
                          console.log("clicked!");
                        }}
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
    </div>
  );
}
