"use client"

import { ColumnDef } from "@tanstack/react-table"

export type PartOrder = {
  partName: string
  quantity: number
  price: number
  totalPrice: number
  teamsRequesting: string
  link: string
  partNumber: string
  
}

export const columns: ColumnDef<PartOrder>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "teamsRequesting",
    header: "Teams Requesting",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "button",
    header: "",
  }
]