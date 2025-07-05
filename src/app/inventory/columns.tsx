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
export type Item = {
  id: string;
  name: string;
  category: string;
  amount: number;
  description: string;
};
export const columns = (
  collection: string,
  team: string,
  onItemAdded: () => void
): ColumnDef<Item>[] => [
  {
    accessorKey: "name",
    header: "Item",
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Total #",
  },
  {
    accessorKey: "description",
    header: "Optional notes",
  },
  {
    accessorKey: "actions",
    header: () => {
      return (
        <div className="grid grid-cols-[auto_auto] justify-self-end items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-base mb-4 font-semibold">Filter by</div>
              <div className="text-sm my-2">Name</div>
              <div>
                <Input
                  placeholder="Filter items by name"
                  className="mb-4"
                ></Input>
              </div>
              <div className="my-2 text-sm">Category</div>
              <div className="flex flex-wrap gap-3">
                {[
                  "Metal",
                  "Wheels",
                  "Electronics",
                  "Gears/Sprockets",
                  "Pneumatics",
                  "Game Elements",
                ].map((team) => (
                  <div key={team} className="flex items-center gap-2">
                    <Checkbox id={`team-${team}`} />
                    <Label htmlFor={`team-${team}`}>{team}</Label>
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
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      console.log(item);
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
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const response = await fetch(`/api/add-inventory-item`, {
                    method: "DELETE",
                    body: JSON.stringify({
                      collection: collection,
                      team: team,
                      id: item.id,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  onItemAdded();
                } catch (err) {
                  console.error("Error submitting transaction:", err);
                }
              }}
              className="text-red-500"
            >
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
