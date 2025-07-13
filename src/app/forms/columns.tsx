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
  onChange: () => void
): ColumnDef<Payment>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "paid",
    header: "Paid?",
    cell: ({ row }) => {
      const value = row.original.paid;
      console.log(value);
      return (
        <Checkbox
          defaultChecked={value}
          onCheckedChange={async (checked) => {
            try {
              await fetch(`/api/update-payment-response`, {
                method: "PATCH",
                body: JSON.stringify({ document: document , name: row.original.name, paid: !value }),
              })
            } catch (error) {
              console.error("Error updating payment:", error);
            }
          }}
        />
      );
    },
  },
];
