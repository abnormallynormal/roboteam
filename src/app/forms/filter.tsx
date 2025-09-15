"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function FilterPopup({
  columnFilters,
  setColumnFilters,
}: {
  columnFilters: any;
  setColumnFilters: any;
}) {
  const name = columnFilters.find((f: any) => f.id === "name")?.value || "";
  
  // Get selected teams from column filters
  const selectedTeams = columnFilters.find((f: any) => f.id === "team")?.value || [];
  
  // Get selected completion status from column filters
  const selectedCompletionStatus = columnFilters.find((f: any) => f.id === "completion")?.value || [];
  
  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  const onTeamFilterChange = (teams: string[]) => {
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== "team")
        .concat(teams.length > 0 ? {
          id: "team",
          value: teams,
        } : [])
    );
  };

  const onCompletionStatusFilterChange = (statuses: string[]) => {
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== "completion")
        .concat(statuses.length > 0 ? {
          id: "completion",
          value: statuses,
        } : [])
    );
  };

  const hasActiveFilters = name.length > 0 || selectedTeams.length > 0 || selectedCompletionStatus.length > 0;

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-4">
      <div>
        <Input
          placeholder="Search by name"
          type="text"
          value={name}
          onChange={(e) => onFilterChange("name", e.target.value)}
          className="text-sm"
        />
      </div>
      
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Filter />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-2">
            <div className="text-base mb-2 font-semibold">
              Filter options
            </div>
            
            <div className="my-2 text-sm">Team</div>
            <div className="flex flex-wrap gap-3 mb-4">
              {["82855G", "82855S", "82855T", "82855X", "82855Y", "82855Z"].map(
                (team) => (
                  <div key={team} className="flex items-center gap-2">
                    <Checkbox
                      id={`team-${team}`}
                      checked={selectedTeams.includes(team)}
                      onCheckedChange={(checked) => {
                        const newSelectedTeams = checked
                          ? [...selectedTeams, team]
                          : selectedTeams.filter((t: string) => t !== team);
                        onTeamFilterChange(newSelectedTeams);
                      }}
                    />
                    <Label htmlFor={`team-${team}`}>{team}</Label>
                  </div>
                )
              )}
            </div>

            <div className="my-2 text-sm">Completion Status</div>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="complete"
                  checked={selectedCompletionStatus.includes("complete")}
                  onCheckedChange={(checked) => {
                    const newSelectedStatuses = checked
                      ? [...selectedCompletionStatus.filter((s: string) => s !== "complete"), "complete"]
                      : selectedCompletionStatus.filter((s: string) => s !== "complete");
                    onCompletionStatusFilterChange(newSelectedStatuses);
                  }}
                />
                <Label htmlFor="complete">All forms submitted</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="incomplete"
                  checked={selectedCompletionStatus.includes("incomplete")}
                  onCheckedChange={(checked) => {
                    const newSelectedStatuses = checked
                      ? [...selectedCompletionStatus.filter((s: string) => s !== "incomplete"), "incomplete"]
                      : selectedCompletionStatus.filter((s: string) => s !== "incomplete");
                    onCompletionStatusFilterChange(newSelectedStatuses);
                  }}
                />
                <Label htmlFor="incomplete">Not all forms submitted</Label>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setColumnFilters([]);
                }}
                className="w-full"
              >
                Clear filters
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}