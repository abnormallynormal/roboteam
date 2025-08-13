"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MarkItemReturned from "@/components/mark-item-returned";

export type BorrowedItem = {
  value: string;
  borrowerName: string;
  borrowerTeam: string;
  borrowedItem: string;
  quantity: number;
  missing: number;
  borrowedDate: string;
};

// Separate component for the cell content
function ReturnButton({
  missing,
  value,
  name,
  updateTable,
}: {
  missing: number;
  value: string;
  name: string;
  updateTable: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        
        <Button variant="ghost" className="w-8 h-8 p-0" size="icon">
          <Check className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-4 py-3">
        <div className="font-semibold mb-2">Mark item as Returned</div>
        <MarkItemReturned
          maxQ={missing}
          value={value}
          name={name}
          handleSubmit={() => {
            setOpen(false);
            updateTable();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export const borrowedColumns = (
  onItemAdded: () => void
): ColumnDef<BorrowedItem>[] => [
  {
    accessorKey: "borrowerName",
    header: "Name",
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
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <ReturnButton
          missing={row.original.missing}
          value={row.original.value}
          name={row.original.borrowerName}
          updateTable={onItemAdded}
        />
      );
    },
  },
];
