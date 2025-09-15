"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const team = columnFilters.find((f: any) => f.id === "team")?.value || "";
  
  // Get selected teams from column filters
  const selectedTeams = columnFilters.find((f: any) => f.id === "team")?.value || [];
  
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

  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-4">
      <div>
        <Input
          placeholder="Search by name"
          type="text"
          value={name}
          onChange={(e) => onFilterChange("name", e.target.value)}
          className="text-sm"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Filter />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by team</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-3 p-3">
            {["82855G", "82855S", "82855T", "82855X", "82855Y", "82855Z"].map(
              (team) => (
                <div key={team} className="flex items-center gap-3">
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
        </DropdownMenuContent>
      </DropdownMenu>
      <div>
        <Button
          variant="outline"
          onClick={() => {
            setColumnFilters([]);
          }}
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
