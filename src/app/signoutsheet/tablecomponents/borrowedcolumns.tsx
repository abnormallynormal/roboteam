"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export type BorrowedItem = {
  value: string;
  borrowerName: string;
  borrowerTeam: string;
  borrowedItem: string;
  quantity: number;
  missing: number;
  borrowedDate: string;
};

export const borrowedColumns: ColumnDef<BorrowedItem>[] = [
  {
    accessorKey: "borrowerName",
    header: "Name",
  },
  {
    accessorKey: "borrowerTeam",
    header: "Team",
  },
  {
    accessorKey: "borrowedItem",
    header: "Borrowed Item",
  },
  {
    accessorKey: "quantity",
    header: "Borrowed Quantity",
  },
  {
    accessorKey: "missing",
    header: "Still Missing",
  },
  {
    accessorKey: "borrowedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "datetime",
    sortDescFirst: true,
  },
  {
    accessorKey: "button",
    header: "",
    cell: ({ row }) => {
      return (
        <Button variant="default" className="w-full">
          Mark as Returned
        </Button>
      );
    },
  },
];
