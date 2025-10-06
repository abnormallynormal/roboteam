"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "@/components/Navigation";
import {
  Ban,
  CalendarIcon,
  Check,
  ChevronDownIcon,
  Clock,
  Filter,
  X,
} from "lucide-react";
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
import { AttendanceCalendar } from "@/components/attendancecalendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Member {
  _id: string;
  name: string;
  team: string;
  presentDates: string[];
  absentDates: string[];
  lateDates: string[];
}
type AttendanceStatus = "present" | "late" | "absent" | "unmarked";

// Helper function to convert Date to ISO string (YYYY-MM-DD)
const toISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to parse ISO date string in local timezone
const parseISODateLocal = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to format date for display
const formatDisplayDate = (dateStr: string): string => {
  const date = parseISODateLocal(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Attendance() {
  // ALL HOOKS MUST BE AT THE TOP
  const router = useRouter();
  const [switchDetector, setSwitchDetector] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date>(
    new Date()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectedMember, setInspectedMember] = useState<Member>();
  const [needsSorting, setNeedsSorting] = useState(false);
  const [lgCalendarOpen, setLgCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);

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
      setNeedsSorting(true);
      console.log(temp);
    };
    fetchData();
  }, [switchDetector]);

  useEffect(() => {
    if (needsSorting) {
      setMembers((prevMembers) => {
        return prevMembers.map((member) => ({
          ...member,
          presentDates: [...member.presentDates].sort(
            (a: string, b: string) =>
              new Date(a).getTime() - new Date(b).getTime()
          ),
          lateDates: [...member.lateDates].sort(
            (a: string, b: string) =>
              new Date(a).getTime() - new Date(b).getTime()
          ),
          absentDates: [...member.absentDates].sort(
            (a: string, b: string) =>
              new Date(a).getTime() - new Date(b).getTime()
          ),
        }));
      });
      setNeedsSorting(false);
    }
  }, [needsSorting]);

  const updateAttendance = async (
    memberId: string,
    status: AttendanceStatus
  ) => {
    const dateString = toISODateString(selectedDate);

    setMembers((prevMembers) => {
      return prevMembers.map((member) => {
        if (member._id === memberId) {
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
            case "unmarked":
              break;
          }
          return updatedMember;
        }
        return member;
      });
    });
    setNeedsSorting(true);
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateString,
          status,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update attendance");
      }
      const statusMessage = status === "unmarked" ? "cleared" : status;
      toast.success(`Attendance ${statusMessage}`);
      const result = await response.json();
      console.log("Success:", result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update attendance"
      );
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeams]);

  return (
    <div>
      <Navbar />
      <div className="mx-6 md:mx-24 py-16">
        <div className="text-2xl md:text-3xl font-bold my-2">
          Team Attendance
        </div>
        <div className="mb-8 text-sm md:text-base">
          Track member attendance and participation in team activities.
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] gap-4 lg:gap-6">
          <Card className="h-fit hidden lg:block">
            <div className="mx-6 mb-0 text-2xl font-bold">Calendar</div>
            <div className="mx-6 mt-0 p-0">Select date to view attendance</div>
            <div className="justify-items-center px-8">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setSelectedDate(selectedDate);
                  }
                }}
                className="rounded-lg border [--cell-size:--spacing(9)] mt-4"
                buttonVariant="ghost"
              />
            </div>
          </Card>
          <div className="flex flex-row lg:hidden items-center gap-4">
            <div className="text-base font-semibold">
              Select date to view attendance:
            </div>
            <Popover open={lgCalendarOpen} onOpenChange={setLgCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-fit justify-between font-normal"
                >
                  {selectedDate
                    ? formatDisplayDate(toISODateString(selectedDate))
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  required={true}
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setLgCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Card className="h-fit gap-0">
            <div className="mx-4 mb-6 text-xl md:text-2xl font-bold">
              Attendance for {formatDisplayDate(toISODateString(selectedDate))}
            </div>
            <div className="mx-4 grid grid-cols-[1fr_auto_auto] gap-2">
              <Input
                placeholder="Search for team members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTeams([]);
                  setCurrentPage(1);
                }}
                disabled={searchTerm === "" && selectedTeams.length === 0}
                className="text-sm"
              >
                Clear filters
              </Button>
            </div>
            <div className="space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center mt-6">No members found</div>
              ) : (
                paginatedMembers.map((member) => {
                  const currentDateISO = toISODateString(selectedDate);
                  const isPresent =
                    member.presentDates.includes(currentDateISO);
                  const isLate = member.lateDates.includes(currentDateISO);
                  const isAbsent = member.absentDates.includes(currentDateISO);

                  return (
                    <Card key={member._id} className="mx-4 mt-4 p-4">
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <div className="grid grid-rows-2">
                          <Button
                            className="justify-start gap-0 p-0 h-fit"
                            variant="link"
                            onClick={() => {
                              setDialogOpen(true);
                              setInspectedMember(member);
                            }}
                          >
                            <div className="text-base font-semibold">
                              {member.name}
                            </div>
                          </Button>
                          <div className="text-sm">{member.team}</div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end space-y-2">
                          <div className="flex gap-2">
                            {isPresent ? (
                              <Button
                                variant="outline"
                                className="text-white border-green-500 bg-green-500 hover:bg-green-500 hover:text-white dark:text-white dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                              >
                                Present
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white dark:text-green-500 dark:border-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "present")
                                }
                              >
                                Present
                              </Button>
                            )}
                            {isLate ? (
                              <Button
                                variant="outline"
                                className="text-white border-yellow-500 bg-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-white dark:border-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                              >
                                Late
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "late")
                                }
                              >
                                Late
                              </Button>
                            )}
                            {isAbsent ? (
                              <Button
                                variant="outline"
                                className="text-white border-red-500 bg-red-500 hover:bg-red-500 hover:text-white dark:text-white dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                              >
                                Absent
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "absent")
                                }
                              >
                                Absent
                              </Button>
                            )}
                          </div>
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                            onClick={() =>
                              updateAttendance(member._id, "unmarked")
                            }
                          >
                            Clear
                          </button>
                        </div>
                        <div className="sm:hidden flex flex-col items-end space-y-2">
                          <div className="flex gap-2">
                            {isPresent ? (
                              <Button
                                variant="outline"
                                className="text-white border-green-500 bg-green-500 hover:bg-green-500 hover:text-white dark:text-white dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                                size="icon"
                              >
                                <Check />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white dark:text-green-500 dark:border-green-500 dark:hover:bg-green-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "present")
                                }
                                size="icon"
                              >
                                <Check />
                              </Button>
                            )}
                            {isLate ? (
                              <Button
                                variant="outline"
                                className="text-white border-yellow-500 bg-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-white dark:border-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                                size="icon"
                              >
                                <Clock />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "late")
                                }
                                size="icon"
                              >
                                <Clock />
                              </Button>
                            )}
                            {isAbsent ? (
                              <Button
                                variant="outline"
                                className="text-white border-red-500 bg-red-500 hover:bg-red-500 hover:text-white dark:text-white dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                                size="icon"
                              >
                                <X />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                                onClick={() =>
                                  updateAttendance(member._id, "absent")
                                }
                                size="icon"
                              >
                                <X />
                              </Button>
                            )}
                          </div>
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                            onClick={() =>
                              updateAttendance(member._id, "unmarked")
                            }
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {filteredMembers.length > membersPerPage && (
              <div className="flex items-center justify-between px-4 py-3 mt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredMembers.length)} of{" "}
                  {filteredMembers.length} members
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-[80vw]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{inspectedMember?.name}</DialogTitle>
            <DialogDescription>{inspectedMember?.team}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 p-1">
              <div className="flex justify-center sm:justify-start">
                <AttendanceCalendar
                  mode="single"
                  selected={selectedDate}
                  presentDates={inspectedMember?.presentDates}
                  absentDates={inspectedMember?.absentDates}
                  lateDates={inspectedMember?.lateDates}
                />
              </div>

              <div className="min-w-0">
                <ScrollArea className="w-full h-[300px] sm:h-[350px]">
                  <Accordion type="multiple" className="w-auto pr-4">
                    <AccordionItem value="present">
                      <AccordionTrigger>
                        Present: {inspectedMember?.presentDates.length}
                      </AccordionTrigger>
                      <AccordionContent>
                        {inspectedMember?.presentDates.map((date) => {
                          return (
                            <div key={date} className="py-1">
                              {formatDisplayDate(date)}
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="late">
                      <AccordionTrigger>
                        Late: {inspectedMember?.lateDates.length}
                      </AccordionTrigger>
                      <AccordionContent>
                        {inspectedMember?.lateDates.map((date) => {
                          return (
                            <div key={date} className="py-1">
                              {formatDisplayDate(date)}
                            </div>
                          );
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
                            <div key={date} className="py-1">
                              {formatDisplayDate(date)}
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
