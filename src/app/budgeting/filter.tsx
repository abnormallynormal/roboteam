"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDownIcon } from "lucide-react";
export default function FilterPopup({
  columnFilters,
  setColumnFilters,
  categories,
}: {
  columnFilters: any;
  setColumnFilters: any;
  categories: { label: string; value: string }[];
}) {
  const description =
    columnFilters.find((f: any) => f.id === "description")?.value || "";
  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== id)
        .concat({
          id,
          value,
        })
    );
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [checkedBoxes, setCheckedBoxes] = React.useState<string[]>([]);
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const handleDateChange = React.useCallback((date: Date | undefined, isStartDate: boolean) => {
    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    
    // Update filters immediately
    setColumnFilters((prev: any) => {
      const newFilters = prev.filter((f: any) => f.id !== "date");
      const currentStartDate = isStartDate ? date : startDate;
      const currentEndDate = isStartDate ? endDate : date;
      
      if (currentStartDate) {
        newFilters.push({ id: "date", value: currentStartDate });
      }
      if (currentEndDate) {
        newFilters.push({ id: "date", value: currentEndDate });
      }
      return newFilters;
    });
  }, [setColumnFilters]);

  const handleCategoryChange = React.useCallback((category: { label: string; value: string }, checked: string | boolean) => {
    const isChecked = checked === true;
    setColumnFilters((prev: any) => {
      const existingCategoryFilter = prev.find(
        (filter: any) => filter.id === "category"
      );

      if (isChecked) {
        setCheckedBoxes((prev) => [...prev, category.value]);
        if (existingCategoryFilter) {
          // Update existing filter
          const updatedValue = [...existingCategoryFilter.value, category.value];
          return prev.map((filter: any) =>
            filter.id === "category"
              ? { ...filter, value: updatedValue }
              : filter
          );
        } else {
          // Create new filter
          return prev.concat({
            id: "category",
            value: [category.value],
          });
        }
      } else {
        setCheckedBoxes((prev) =>
          prev.filter((val) => val !== category.value)
        );
        // Remove category from filter
        if (existingCategoryFilter) {
          const updatedValue = existingCategoryFilter.value.filter(
            (val: string) => val !== category.value
          );
          if (updatedValue.length === 0) {
            // Remove entire filter if no categories left
            return prev.filter((filter: any) => filter.id !== "category");
          } else {
            // Update filter with remaining categories
            return prev.map((filter: any) =>
              filter.id === "category"
                ? { ...filter, value: updatedValue }
                : filter
            );
          }
        }
        return prev;
      }
    });
  }, [setColumnFilters]);

  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-4">
      <div>
        <Input
          placeholder="Filter items by description"
          type="text"
          value={description}
          onChange={(e) => onFilterChange("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-3">
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {startDate ? startDate.toLocaleDateString() : "Start date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                handleDateChange(date, true);
                setStartOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <span className="self-center justify-self-center text-sm">to</span>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {endDate ? endDate.toLocaleDateString() : "End date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                handleDateChange(date, false);
                setEndOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Filter />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="text-base mb-4 font-semibold">
            More filtering options
          </div>
          <div className="my-2 text-sm">Category</div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center gap-2">
                <Checkbox
                  id={`team-${category.value}`}
                  checked={checkedBoxes.includes(category.value)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                />
                <Label htmlFor={`team-${category.value}`}>
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
