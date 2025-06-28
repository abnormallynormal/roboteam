"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export default function Calendar18() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date()
  )

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={
        (selectedDate) => {
          setDate(selectedDate)
          
        }
      }
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
      buttonVariant="ghost"
    />
  )
}
