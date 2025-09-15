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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddItemForm from "@/components/add-item-form";
import { ObjectId } from "mongodb";
export type Payment = {
  id: string;
  name: string;
  team: string;
  amount: number;
  paid: boolean;
  memberResponses: Array<{
    formName: string;
    completed: boolean;
  }>;
};

export const columns = (
  document: string,
  onChange: () => void,
  arr: any[]
): ColumnDef<Payment>[] => [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue("team") as string;
      const b = rowB.getValue("team") as string;
      return a.localeCompare(b);
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "completion",
    header: () => null, // Hide the header
    filterFn: (row: any, columnId: any, filterValue: any) => {
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      
      // Check if all forms are completed
      const allCompleted = row.original.memberResponses.every(
        (response: any) => response.completed === true
      );
      
      const status = allCompleted ? "complete" : "incomplete";
      return filterValue.includes(status);
    },
    cell: () => null, // Hide the cell content
    enableSorting: false,
    size: 0, // Minimize column width
  },
  ...arr.map((item) => ({
    accessorKey: item.name,
    header: () => {
      return item.type.toString() === "Payment" ? (
        <div>
          {item.name} (
          {new Intl.NumberFormat("us-US", {
            style: "currency",
            currency: "CAD",
          }).format(item.amount)}
          )
        </div>
      ) : (
        <div>{item.name}</div>
      );
    },
    cell: ({ row }: { row: any }) => {
      console.log(row.original.name);
      const value = row.original.memberResponses.find(
        (response: any) => response.formName === item.name
      ).completed;

      return (
        <Checkbox
          defaultChecked={value}
          onCheckedChange={async (checked) => {
            try {
              await fetch(`/api/update-form-response`, {
                method: "PATCH",
                body: JSON.stringify({
                  document: document,
                  username: row.original.name,
                  specificFormName: item,
                  bool: !value,
                }),
              });
            } catch (error) {
              console.error("Error updating form response:", error);
            }
          }}
        />
      );
    },
  })),
];
