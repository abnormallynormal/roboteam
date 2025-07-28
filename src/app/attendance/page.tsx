"use client";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "@/components/Navigation";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { boolean, record } from "zod";
import { AttendanceCalendar } from "@/components/attendancecalendar";

interface Member {
  _id: string;
  name: string;
  team: string;
  presentDates: string[];
  absentDates: string[];
  lateDates: string[];
}
type AttendanceStatus = "present" | "late" | "absent" | "unmarked";
export default function Attendance() {
  const [switchDetector, setSwitchDetector] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date>(
    new Date()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectedMember, setInspectedMember] = useState<Member>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/api/get-members");
      const data = await result.json();
      const temp: Member[] = [];
      data.forEach((member: any) => {
        const tempPresent: string[] = [];
        const tempLate: string[] = [];
        const tempAbsent: string[] = [];
        member.present.forEach((date: string) => {
          tempPresent.push(date.slice(0, 10));
        });
        member.late.forEach((date: string) => {
          tempLate.push(date.slice(0, 10));
        });
        member.absent.forEach((date: string) => {
          tempAbsent.push(date.slice(0, 10));
        });
        temp.push({
          _id: member._id,
          name: member.name,
          team: member.team,
          presentDates: tempPresent,
          lateDates: tempLate,
          absentDates: tempAbsent,
        });
      });
      setMembers(temp);
      console.log(temp);
    };
    fetchData();
  }, [switchDetector]);

  const updateAttendance = async (
    memberId: string,
    status: AttendanceStatus
  ) => {
    setMembers((prevMembers) => {
      return prevMembers.map((member) => {
        if (member._id === memberId) {
          const dateString = selectedDate.toLocaleDateString().slice(0, 10);
          const updatedMember = {
            ...member,
            presentDates: member.presentDates.filter(
              (date) => date !== dateString
            ),
            lateDates: member.lateDates.filter((date) => date !== dateString),
            absentDates: member.absentDates.filter(
              (date) => date !== dateString
            ),
          };
          switch (status) {
            case "present":
              updatedMember.presentDates.push(dateString);
              break;
            case "late":
              updatedMember.lateDates.push(dateString);
              break;
            case "absent":
              updatedMember.absentDates.push(dateString);
              break;
          }
          return updatedMember;
        }
        return member;
      });
    });
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        // Replace with actual member ID
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          ).toLocaleDateString(),
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
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <Card className="h-fit">
            <div className="mx-6 mb-0 text-2xl font-bold">Calendar</div>
            <div className="mx-6 mt-0 p-0">Select date to view attendance</div>
            <div className="justify-items-center px-8">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setSelectedDate(selectedDate);
                    console.log(members);
                    console.log(selectedDate);
                  }
                }}
                className="rounded-lg border [--cell-size:--spacing(9)]"
                buttonVariant="ghost"
              />
            </div>
          </Card>
          <Card className="h-fit">
            <div className="mx-6 mb-0 text-2xl font-bold">
              Attendance for {selectedDate.toLocaleDateString().slice(0, 10)}
            </div>
            <div className="mx-6 grid grid-cols-[1fr_auto] gap-2">
              <Input
                placeholder="Search for team members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              {filteredMembers.length === 0 ? (
                <div className="text-center">No members found</div>
              ) : (
                filteredMembers.map((member) => (
                  <Card key={member._id} className="mx-6 my-2 p-4">
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                      <div className="grid grid-rows-2">
                        <Button
                          className="justify-start gap-0 p-0 h-fit"
                          variant="link"
                          onClick={() => {
                            setDialogOpen(true);
                            setInspectedMember(member);
                          }}
                        >
                          <div className="text-lg font-semibold">
                            {member.name}
                          </div>
                        </Button>
                        <div className="text-sm">{member.team}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        {member.presentDates.includes(
                          selectedDate.toLocaleDateString().slice(0, 10)
                        ) ? (
                          <Button
                            variant="outline"
                            className="text-white border-green-500 bg-green-500 hover:bg-green-500 hover:text-white dark:text-white dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Present"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white dark:text-green-500 dark:border-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                            onClick={() =>
                              updateAttendance(member._id, "present")
                            }
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Present"}
                          </Button>
                        )}
                        {member.lateDates.includes(
                          selectedDate.toLocaleDateString().slice(0, 10)
                        ) ? (
                          <Button
                            variant="outline"
                            className="text-white border-yellow-500 bg-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-white dark:border-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Late"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                            onClick={() => updateAttendance(member._id, "late")}
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Late"}
                          </Button>
                        )}
                        {member.absentDates.includes(
                          selectedDate.toLocaleDateString().slice(0, 10)
                        ) ? (
                          <Button
                            variant="outline"
                            className="text-white border-red-500 bg-red-500 hover:bg-red-500 hover:text-white dark:text-white dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Absent"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                            onClick={() =>
                              updateAttendance(member._id, "absent")
                            }
                            disabled={isLoading === member._id}
                          >
                            {isLoading === member._id ? "..." : "Absent"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{inspectedMember?.name}</DialogTitle>
            <DialogDescription>{inspectedMember?.team}</DialogDescription>
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <AttendanceCalendar
                mode="single"
                selected={selectedDate}
                presentDates={inspectedMember?.presentDates}
                absentDates={inspectedMember?.absentDates}
                lateDates={inspectedMember?.lateDates}
              />
              <div>
                <Accordion type="multiple" >
                  <AccordionItem value="present">
                    <AccordionTrigger>
                      Present: {inspectedMember?.presentDates.length}
                    </AccordionTrigger>
                    <AccordionContent>
                      {inspectedMember?.presentDates.map((date) => {
                        return <div key={date}>{date}</div>;
                      })}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="late">
                    <AccordionTrigger>
                      Late: {inspectedMember?.lateDates.length}
                    </AccordionTrigger>
                    <AccordionContent>
                      {inspectedMember?.lateDates.map((date) => {
                        return <div key={date}>{date}</div>;
                      })}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="absent">
                    <AccordionTrigger>
                      Absent: {inspectedMember?.absentDates.length}
                    </AccordionTrigger>
                    <AccordionContent>
                      {inspectedMember?.absentDates.map((date) => {
                        return (
                          <div key={date}>
                            {date}
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
