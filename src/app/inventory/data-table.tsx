"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditItemForm from "@/components/edit-item-form";
import * as React from "react";
import { useState } from "react";
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
  getFilteredRowModel,
  ColumnFiltersState,
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
import { Item } from "./columns";
import AddItemForm from "@/components/add-item-form";
interface DataTableProps<TData extends Item, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  collection: string;
  team: string;
  onItemAdded: () => void;
}

export function DataTable<TData extends Item, TValue>({
  columns,
  data,
  collection,
  team,
  onItemAdded,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [trigger, setTrigger] = useState(false);
  const [item, setItem] = useState<TData | undefined>();

  const handleCheckboxChange = ({
    category,
    checked,
  }: {
    category: any;
    checked: boolean;
  }) => {
    if (checked) {
      setCheckedCategories((prev: any) => [...prev, category]);
    } else {
      setCheckedCategories((prev: any) =>
        prev.filter((item: any) => item != category)
      );
    }
  };
  const description =
    columnFilters.find((f: any) => f.id === "name")?.value?.toString() || "";

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div>
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 mb-4">
          <div>
            <Input
              placeholder="Search items by name"
              type="text"
              value={description}
              onChange={(e) => {
                onFilterChange("name", e.target.value);
              }}
            ></Input>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-base mb-2 font-semibold">
                More filter options
              </div>
              <div className="my-2 text-sm">Category</div>
              <div className="flex flex-wrap gap-3">
                {["Food", "Clothes", "Entertainment"].map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={category}
                      checked={checkedCategories.some(
                        (item: any) => item === category
                      )}
                      onCheckedChange={(checked) => {
                        setColumnFilters((prev: any) => {
                          const existingCategoryFilter = prev.find(
                            (filter: any) => filter.id === "category"
                          );
                          if (checked) {
                            handleCheckboxChange({ category, checked: true });
                            if (existingCategoryFilter) {
                              // Update existing filter
                              const updatedValue = [
                                ...existingCategoryFilter.value,
                                category,
                              ];
                              return prev.map((filter: any) =>
                                filter.id === "category"
                                  ? { ...filter, value: updatedValue }
                                  : filter
                              );
                            } else {
                              // Create new filter
                              return prev.concat({
                                id: "category",
                                value: [category],
                              });
                            }
                          } else {
                            handleCheckboxChange({
                              category,
                              checked: false,
                            });
                            if (existingCategoryFilter) {
                              const updatedValue =
                                existingCategoryFilter.value.filter(
                                  (val: string) => val != category
                                );
                              if (updatedValue.length === 0) {
                                // Remove entire filter if no categories left
                                return prev.filter(
                                  (filter: any) => filter.id !== "category"
                                );
                              } else {
                                // Update filter with remaining categories
                                return prev.map((filter: any) =>
                                  filter.id === "category"
                                    ? { ...filter, value: updatedValue }
                                    : filter
                                );
                              }
                            }
                            return prev;
                          }
                        });
                      }}
                    />
                    <Label htmlFor={category}>{category}</Label>
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
                          setItem(row.original);
                          setTrigger(!trigger)
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
      <Dialog open={trigger}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <EditItemForm
            collection={collection}
            team={team}
            name={item?.name}
            categoryP={item?.category}
            amount={item?.amount}
            description={item?.description}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
