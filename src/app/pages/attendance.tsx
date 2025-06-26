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
import Calendar18 from "@/components/calendar-18";
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
export default function Attendance() {
  return (
    <div>
      <Navbar />
      <div className="px-16 py-4">
        <div className="text-3xl font-bold my-2">Team Attendance</div>
        <div className="mb-8">
          Track member attendance and participation in team activities.
        </div>
        <div className="grid grid-cols-4 gap-8 mb-8">
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Total members</div>
                <div className="font-bold text-3xl">6</div>
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
                <div className="font-bold text-3xl">6</div>
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
                <div className="font-bold text-3xl">6</div>
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
                <div className="font-bold text-3xl">6</div>
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
              <Input placeholder="Search for team members" />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ListFilter className="b-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by team</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-3 p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855G</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855S</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855T</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855X</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855Y</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">82855Z</Label>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Card className="mx-6 my-2 p-4">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid grid-rows-2">
                  <div className="text-lg font-semibold">LeBron James</div>
                  <div className="text-sm">82855S</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Button className="outline-green-500 w-auto">Present</Button>
                  <Button className="bg-yellow-500">Late</Button>
                  <Button className="bg-red-500">Absent</Button>
                </div>
              </div>
            </Card>
          </Card>
          <Card>
            <div className="mx-6 mb-0 text-2xl font-bold">Calendar</div>
            <div className="mx-6 mt-0 p-0">Select date to view attendance</div>
            <div className="justify-items-center">
              <Calendar18 />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
