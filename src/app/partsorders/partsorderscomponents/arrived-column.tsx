"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ArrivedPartOrder = {
  partName: string
  quantity: number
  price: number
  totalPrice: number
  teamsRequesting: string
  link: string
  partNumber: string
  
}

export const arrivedColumns: ColumnDef<ArrivedPartOrder>[] = [
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
  }
]
