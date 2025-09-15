"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import EditMemberForm from "@/components/edit-member-form";
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
import AddMemberForm from "@/components/add-member-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
export type Member = {
  _id: string;
  name: string;
  team: string;
};
export const columns = (
  collection: string,
  team: string,
  onItemAdded: () => void,
  onDialogTriggered: () => void
): ColumnDef<Member>[] => [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
  },
  {
    accessorKey: "team",
    header: "Team",
    filterFn: (row, columnId, filterValue) => {
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return (
        <div className="">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <div className="flex flex-row items-center gap-2">
                  <Plus />
                  <div className="hidden md:block">Add Member</div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent avoidCollisions={true}>
              <AddMemberForm onItemAdded={onItemAdded} />
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
                  Edit Member
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="!text-red-500"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/member-list`, {
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
                    console.error("Error deleting member:", err);
                  }
                }}
              >
                Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <EditMemberForm
              name={row.original.name}
              team={row.original.team}
              id={row.original._id}
              onItemAdded={onItemAdded}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
