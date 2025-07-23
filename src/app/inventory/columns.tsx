"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Filter, MoreHorizontal, Plus, PencilIcon, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditItemForm from "@/components/edit-item-form";
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
    filterFn: "includesString",
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, columnId, filterValue) => {
      console.log(filterValue + " HI " + row.getValue(columnId));
      if (!Array.isArray(filterValue)) return true;
      return filterValue.includes(row.getValue(columnId));
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
      return <div></div>;
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex flex-gap-2 justify-self-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PencilIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogDescription>
                  Tip: Double click on the row you wish to edit to open the edit form.
                </DialogDescription>
              </DialogHeader>
              <EditItemForm
                collection={collection}
                team={team}
                id={item.id}
                name={item.name}
                categoryP={item.category}
                amount={item.amount}
                description={item.description}
                onItemAdded={onItemAdded}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
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
            className="!text-red-500"
          >
            <Trash />
          </Button>
        </div>
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuItem>Edit item</DropdownMenuItem>
        //     <DropdownMenuItem
        //       onClick={async () => {
        //         try {
        //           const response = await fetch(`/api/add-inventory-item`, {
        //             method: "DELETE",
        //             body: JSON.stringify({
        //               collection: collection,
        //               team: team,
        //               id: item.id,
        //             }),
        //             headers: {
        //               "Content-Type": "application/json",
        //             },
        //           });
        //           onItemAdded();
        //         } catch (err) {
        //           console.error("Error submitting transaction:", err);
        //         }
        //       }}
        //       className="!text-red-500"
        //     >
        //       Delete item
        //     </DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
      );
    },
  },
];
