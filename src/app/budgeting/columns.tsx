"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTransactionForm from "@/components/add-transaction-form";
import { ObjectId } from "mongodb";
const category = [
  { label: "Parts Orders", value: "parts-orders" },
  { label: "Tournament Fees", value: "tournament" },
  { label: "Food", value: "food" },
  { label: "Sponsorships", value: "sponsors" },
  { label: "Grants", value: "grants" },
  { label: "Miscellaneous", value: "misc" },
] as const;
export type Transaction = {
  _id: string;
  type: "Expense" | "Revenue";
  description: string;
  amount: number;
  category: (typeof category)[number]["value"];
  date: string;
};
export const columns = (
  collection: string,
  team: string,
  onItemAdded: () => void
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>;
    },
    sortingFn: "datetime",
    sortDescFirst: true,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "description",
    header: "Description",
    filterFn: "includesString",
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "amount",
    header: "Amount (CAD)",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("type") === "Revenue" ? (
            <div className="text-green-600">
              +
              {new Intl.NumberFormat("us-US", {
                style: "currency",
                currency: "CAD",
              }).format(row.getValue("amount"))}
            </div>
          ) : (
            <div className="text-red-600">
              -
              {new Intl.NumberFormat("us-US", {
                style: "currency",
                currency: "CAD",
              }).format(row.getValue("amount"))}
            </div>
          )}
        </div>
      );
    },
    filterFn: "inNumberRange",
  },

  {
    accessorKey: "type",
    header: "Type",
    filterFn: "includesString",
  },
  {
    accessorKey: "actions",
    header: () => {
      return (
        <div className="grid grid-cols-[auto_auto] justify-self-end items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Plus />
                Add item
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" avoidCollisions={true}>
              <AddTransactionForm onItemAdded={onItemAdded} />
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit item</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
