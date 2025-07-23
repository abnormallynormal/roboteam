"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  checkedCategories,
  checkedType,
  onCheckboxChangeAction,
  onCheckedTypeChangeAction,
}: {
  columnFilters: any;
  setColumnFilters: any;
  categories: { label: string; value: string }[];
  checkedCategories: any[];
  checkedType: string | null;
  onCheckboxChangeAction: ({
    category,
    checked,
  }: {
    category: any;
    checked: boolean;
  }) => void;
  onCheckedTypeChangeAction: ({
    type,
    checked,
  }: {
    type: string | null;
    checked: boolean;
  }) => void;
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
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  React.useEffect(() => {
    setColumnFilters((prev: any) => {
      const newFilters = prev ? prev.filter((f: any) => f.id !== "date") : [];
      if (startDate && endDate) {
        newFilters.push({
          id: "date",
          value: { startDate: startDate as Date, endDate: endDate as Date },
        });
      } else if (startDate && !endDate) {
        newFilters.push({
          id: "date",
          value: { startDate: startDate as Date },
        });
      } else if (endDate && !startDate) {
        newFilters.push({ id: "date", value: { endDate: endDate as Date } });
      }

      return newFilters;
    });
  }, [startDate, endDate]);

  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-4">
      <div>
        <Input
          placeholder="Search transactions by description"
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
                setStartDate(date);
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
                setEndDate(date);
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
        <PopoverContent className="mr-2">
          <div className="text-base mb-2 font-semibold">
            More filter options
          </div>
          <div className="my-2 text-sm">Transaction Type</div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="Revenue"
                checked={checkedType == "Revenue"}
                onCheckedChange={(checked) => {
                  setColumnFilters((prev: any) => {
                    const existingTypeFilter = prev.find(
                      (filter: any) => filter.id == "type"
                    );
                    if (checked) {
                      onCheckedTypeChangeAction({
                        type: "Revenue",
                        checked: true,
                      });
                      if (existingTypeFilter) {
                        // Update existing filter
                        const updatedValue = ["Revenue"];
                        return prev.map((filter: any) =>
                          filter.id === "type"
                            ? { ...filter, value: updatedValue }
                            : filter
                        );
                      } else {
                        // Create new filter
                        return prev.concat({
                          id: "type",
                          value: ["Revenue"],
                        });
                      }
                    } else {
                      onCheckedTypeChangeAction({
                        type: "Revenue",
                        checked: false,
                      });
                      if (existingTypeFilter) {
                        return prev.filter(
                          (filter: any) => filter.id !== "type"
                        );
                      }
                      return prev;
                    }
                  });
                }}
              />
              <Label htmlFor="Revenue">Revenue</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="Expense"
                checked={checkedType == "Expense"}
                onCheckedChange={(checked) => {
                  setColumnFilters((prev: any) => {
                    const existingTypeFilter = prev.find(
                      (filter: any) => filter.id === "type"
                    );
                    if (checked) {
                      onCheckedTypeChangeAction({
                        type: "Expense",
                        checked: true,
                      });
                      if (existingTypeFilter) {
                        // Update existing filter
                        const updatedValue = ["Expense"];
                        return prev.map((filter: any) =>
                          filter.id === "type"
                            ? { ...filter, value: updatedValue }
                            : filter
                        );
                      } else {
                        // Create new filter
                        return prev.concat({
                          id: "type",
                          value: ["Expense"],
                        });
                      }
                    } else {
                      onCheckedTypeChangeAction({
                        type: "Expense",
                        checked: false,
                      });
                      if (existingTypeFilter) {
                        const updatedValue = existingTypeFilter.value.filter(
                          (val: string) => val !== "Expense"
                        );
                        if (updatedValue.length === 0) {
                          // Remove entire filter if no types left
                          return prev.filter(
                            (filter: any) => filter.id !== "type"
                          );
                        } else {
                          // Update filter with remaining types
                          return prev.map((filter: any) =>
                            filter.id === "type"
                              ? { ...filter, value: updatedValue }
                              : filter
                          );
                        }
                      }
                      return prev;
                    }
                  });
                }}
              />
              <Label htmlFor="Expense">Expense</Label>
            </div>
          </div>

          <div className="my-2 text-sm">Category</div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center gap-2">
                <Checkbox
                  id={category.value}
                  checked={checkedCategories.some(
                    (item: any) => item.value === category.value
                  )}
                  onCheckedChange={(checked) => {
                    setColumnFilters((prev: any) => {
                      const existingCategoryFilter = prev.find(
                        (filter: any) => filter.id === "category"
                      );
                      if (checked) {
                        onCheckboxChangeAction({ category, checked: true });
                        if (existingCategoryFilter) {
                          // Update existing filter
                          const updatedValue = [
                            ...existingCategoryFilter.value,
                            category.value,
                          ];
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
                        onCheckboxChangeAction({ category, checked: false });
                        if (existingCategoryFilter) {
                          const updatedValue =
                            existingCategoryFilter.value.filter(
                              (val: string) => val !== category.value
                            );
                          if (updatedValue.length === 0) {
                            // Remove entire filter if no categories left
                            return prev.filter(
                              (filter: any) => filter.id !== "category"
                            );
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
                  }}
                />
                <Label htmlFor={category.value}>{category.label}</Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
