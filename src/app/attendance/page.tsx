"use client";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "@/components/Navigation";
import { ListFilter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, UserRoundX, Clock, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";

interface Member {
  _id: string;
  name: string;
  team: string;
}
type AttendanceStatus = "present" | "late" | "absent";
export default function Attendance() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalUnmarked, setTotalUnmarked] = useState(0);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/api/members/${memberId}");
      const data = await result.json();
      setTotalMembers(data.length)
      console.log(totalMembers)
      let presentCount = 0;
      let absentCount = 0;
      let unmarkedCount = 0;
      console.log(members)
      members.forEach((member: any) => {
        const dateStr = selectedDate.toDateString();
        if (member.present.includes(dateStr) || member.late.includes(dateStr)) {
          presentCount++;
        } else if (member.absent.includes(dateStr)) {
          absentCount++;
        } else {
          unmarkedCount++;
        }
      });

      setTotalPresent(presentCount);
      setTotalAbsent(absentCount);
      setTotalUnmarked(unmarkedCount);
      
    }
    fetchData();  
  },[])

  // Mock data - replace with your actual data fetching
  const members: Member[] = [
    { _id: "685f1a71ea298df228d25fe6", name: "LeBron James", team: "82855S" },
    // Add more members...
  ];

  const updateAttendance = async (
    memberId: string,
    status: AttendanceStatus
  ) => {
    setIsLoading(null);
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        // Replace with actual member ID
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update attendance");
      }
      toast.success(`Attendance marked as ${status}`);
      const result = await response.json();
      console.log("Success:", result);
      // Handle success (e.g., show a success message, refresh data)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update attendance"
      );
    } finally {
      setIsLoading(null);
    }
  };
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTeam =
      selectedTeams.length === 0 || selectedTeams.includes(member.team);
    return matchesSearch && matchesTeam;
  });

  return (
    <div>
      <Navbar />
      <div className="px-24 py-4">
        <div className="text-3xl font-bold my-2">Team Attendance</div>
        <div className="mb-8">
          Track member attendance and participation in team activities.
        </div>
        <div className="grid grid-cols-4 gap-8 mb-8">
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Total members</div>
                <div className="font-bold text-3xl">{totalMembers}</div>
                <div className="mt-1 text-sm">Active team members</div>
              </div>
              <div>
                <Users />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Present Today</div>
                <div className="font-bold text-3xl">{totalPresent}</div>
                <div className="mt-1 text-sm">Active team members</div>
              </div>
              <div>
                <UserCheck />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Absent Today</div>
                <div className="font-bold text-3xl">{totalAbsent}</div>

                <div className="mt-1 text-sm">Member not present</div>
              </div>
              <div>
                <UserRoundX />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Not Marked</div>
                <div className="font-bold text-3xl">{totalUnmarked}</div>
                <div className="mt-1 text-sm">Pending attendance</div>
              </div>
              <div>
                <Clock />
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-8">
          <Card>
            <div className="mx-6 mb-0 text-2xl font-bold">Attendance</div>
            <div className="mx-6 grid grid-cols-[1fr_auto] gap-6">
              <Input
                placeholder="Search for team members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ListFilter className="b-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by team</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-3 p-3">
                    {[
                      "82855G",
                      "82855S",
                      "82855T",
                      "82855X",
                      "82855Y",
                      "82855Z",
                    ].map((team) => (
                      <div key={team} className="flex items-center gap-3">
                        <Checkbox
                          id={`team-${team}`}
                          checked={selectedTeams.includes(team)}
                          onCheckedChange={(checked) => {
                            setSelectedTeams((prev) =>
                              checked
                                ? [...prev, team]
                                : prev.filter((t) => t !== team)
                            );
                          }}
                        />
                        <Label htmlFor={`team-${team}`}>{team}</Label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <Card key={member._id} className=" mx-6 my-2 p-4 p-4">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                    <Avatar>
                      <AvatarImage alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid grid-rows-2">
                      <div className="text-lg font-semibold">{member.name}</div>
                      <div className="text-sm">{member.team}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Button
                        variant="outline"
                        className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-700 active:border-green-700"
                        onClick={() => updateAttendance(member._id, "present")}
                        disabled={isLoading === member._id}
                      >
                        {isLoading === member._id ? "..." : "Present"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white active:bg-yellow-700 active:border-yellow-700"
                        onClick={() => updateAttendance(member._id, "late")}
                        disabled={isLoading === member._id}
                      >
                        {isLoading === member._id ? "..." : "Late"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white active:bg-red-700 active:border-red-700"
                        onClick={() => updateAttendance(member._id, "absent")}
                        disabled={isLoading === member._id}
                      >
                        {isLoading === member._id ? "..." : "Absent"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
          <Card>
            <div className="mx-6 mb-0 text-2xl font-bold">Calendar</div>
            <div className="mx-6 mt-0 p-0">Select date to view attendance</div>
            <div className="justify-items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setSelectedDate(selectedDate);
                  }
                }}
                className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                buttonVariant="ghost"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
