"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import EditTransactionForm from "@/components/edit-transaction-form";
import { ArrowUpDown } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
    filterFn: (row, columnId, filterValue) => {
      const dateString = row.getValue(columnId) as string;
      const date = new Date(dateString);
      const { startDate, endDate } = filterValue;
      if ((startDate || endDate) && !date) return false;
      if (startDate && !endDate) {
        return date.getTime() >= startDate.getTime();
      } else if (!startDate && endDate) {
        const newEndDate = new Date(endDate.setHours(23, 59, 59, 999));

        return date.getTime() <= newEndDate.getTime();
      } else if (startDate && endDate) {
        const newEndDate = new Date(endDate.setHours(23, 59, 59, 999));

        return (
          date.getTime() >= startDate.getTime() &&
          date.getTime() <= newEndDate.getTime()
        );
      } else return true;
    },
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
      if (!Array.isArray(filterValue)) return true;
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
    filterFn: (row, columnId, filterValue) => {
      if (filterValue.length === 0 || !Array.isArray(filterValue)) return true;
      return filterValue.includes(row.getValue(columnId));
    },
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
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={async () => {}}>
                  Edit item
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="!text-red-500"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/transactions/{id}`, {
                      method: "DELETE",
                      body: JSON.stringify({
                        id: row.original._id,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                    if (response.status === 200) {
                      onItemAdded?.();
                    }
                  } catch (err) {
                    console.error("Error deleting transaction:", err);
                  }
                }}
              >
                Delete item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit transaction</DialogTitle>
            </DialogHeader>
            <EditTransactionForm
              _id={row.original._id}
              typeP={row.original.type}
              description={row.original.description}
              amount={row.original.amount}
              categoryP={row.original.category}
              onItemAdded={onItemAdded}
              
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
