"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export type ReturnedItem = {
  returnerName: string;
  returnerTeam: string;
  returnedItem: string;
  quantity: number;
  returned: number;
  returnedDate: string;
};

export const returnedColumns: ColumnDef<ReturnedItem>[] = [
  {
    accessorKey: "returnerName",
    header: "Name",
  },
  {
    accessorKey: "returnerTeam",
    header: "Team",
  },
  {
    accessorKey: "returnedItem",
    header: "Returned Item",
  },
  {
    accessorKey: "quantity",
    header: "Borrowed Quantity",
  },
  {
    accessorKey: "returned",
    header: "Items Returned",
  },
  {
    accessorKey: "returnedDate",
    header: "Date",
  },
  {
    accessorKey: "button",
    header: "",
    cell: ({ row }) => {
      const item = row.original;
      console.log(item);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
