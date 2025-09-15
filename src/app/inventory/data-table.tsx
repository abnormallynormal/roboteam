import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  getPaginationRowModel,
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

const inventoryCategories = [
  { value: "Metal", label: "Metal" },
  { value: "Wheels", label: "Wheels" },
  { value: "Motors", label: "Motors" },
  { value: "Electronics", label: "Electronics" },
  { value: "Gears", label: "Gears" },
  { value: "Pneumatics", label: "Pneumatics" },
  { value: "Tools", label: "Tools" },
  { value: "Game Elements", label: "Game Elements" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [item, setItem] = useState<
    { data: TData; selected: string } | undefined
  >();

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
    getPaginationRowModel: getPaginationRowModel(),
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
              className="text-sm"
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
                {inventoryCategories.map((category) => (
                  <div key={category.value} className="flex items-center gap-2">
                    <Checkbox
                      id={category.value}
                      checked={checkedCategories.some(
                        (item: any) => item === category.value
                      )}
                      onCheckedChange={(checked) => {
                        setColumnFilters((prev: any) => {
                          const existingCategoryFilter = prev.find(
                            (filter: any) => filter.id === "category"
                          );
                          if (checked) {
                            handleCheckboxChange({ category: category.value, checked: true });
                            if (existingCategoryFilter) {
                              // Update existing filter
                              const updatedValue = [
                                ...existingCategoryFilter.value,
                                category.value,
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
                                value: [category.value],
                              });
                            }
                          } else {
                            handleCheckboxChange({
                              category: category.value,
                              checked: false,
                            });
                            if (existingCategoryFilter) {
                              const updatedValue =
                                existingCategoryFilter.value.filter(
                                  (val: string) => val != category.value
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
                    <Label htmlFor={category.value}>{category.label}</Label>
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
                            : "text-left py-0"
                        }
                        onDoubleClick={() => {
                          setItem({
                            data: row.original,
                            selected: cell.column.id,
                          });
                          console.log(cell.column.id);
                          setIsDialogOpen(true);
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
      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <EditItemForm
            collection={collection}
            team={team}
            id={item?.data.id}
            name={item?.data.name}
            categoryP={item?.data.category}
            amount={item?.data.amount}
            description={item?.data.description}
            onItemAdded={() => {
              setIsDialogOpen(false);
              onItemAdded?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
