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
};

export const columns = (
  document: string,
  onChange: () => void,
  arr: any[]
): ColumnDef<Payment>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  ...arr.map((item) => ({
    accessorKey: item.name,
    header: () => {
      return item.type.toString() === "Payment" ? (
        <div>
          {item.name} (${item.amount})
        </div>
      ) : (
        <div>{item.name}</div>
      );
    },
    cell: ({ row }: { row: any }) => {
      const value = row.original.responses.find((response: any) => response.formName === item.name).completed;
      
      console.log(typeof value);
      console.log(row.original.name)
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
