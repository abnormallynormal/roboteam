"use client";
import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "./modetoggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { SignOut } from "../lib/auth-action";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav className={`fixed w-full z-20 top-0 start-0 backdrop-blur-md transition-colors duration-300 ${
      isScrolled 
        ? 'bg-gray-200/80 dark:bg-gray-800/80' 
        : 'bg-white/50 dark:bg-black/50'
    }`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-row w-full justify-between">
            <div className=" flex w-full gap-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu />
              </Button>
              <div className="text-xl font-bold self-center">RoboTeam</div>
              <div className="ml-auto mr-4">
                <ModeToggle />
              </div>
            </div>
            <div className="text-xl font-bold self-center hidden lg:block">
              RoboTeam
            </div>
            <div className="hidden lg:block">
              <div className="flex ml-10 items-baseline space-x-2">
                <NavigationMenu viewport={false}>
                  <NavigationMenuList className="flex flex-row">
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/budgeting">Dashboard</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Finances</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/budgeting">Budget</Link>
                        </NavigationMenuLink>
                        {/* <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/partsorders">Parts Orders</Link>
                        </NavigationMenuLink> */}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        Inventory Management
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/inventory">Inventory Counts</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/signoutform">Sign Out Form</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/signoutsheet">
                            Sign Out Form Tracker
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        Administration
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/attendance">Attendance</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/forms">Forms</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <Link href="/members">Member List</Link>
                        </NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="ml-4">
                      <ModeToggle />
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Button
                  onClick={() => {
                    SignOut();
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>

            <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <SheetContent className="w-auto min-w-[300px]" side="left">
                <SheetHeader>
                  <SheetTitle className="text-xl font-black">
                    RoboTeam
                  </SheetTitle>
                </SheetHeader>
                <div>
                  <Button
                    className="px-4 font-bold m-0"
                    variant="link"
                    onClick={() => router.push("/")}
                  >
                    Home
                  </Button>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-light px-4 mb-2">Finances</div>
                  <div>
                    <Button
                      className="px-4 py-0 mb-2 font-bold text-base h-auto"
                      variant="link"
                      onClick={() => router.push("/budgeting")}
                    >
                      Budgeting
                    </Button>
                  </div>
                  {/* <div>
                    <Button
                      className="px-4 py-0 font-bold text-base h-auto"
                      variant="link"
                      onClick={() => router.push("/partsorders")}
                    >
                      Parts Orders
                    </Button>
                  </div> */}
                </div>
                <div className="mb-2">
                  <div className="text-sm font-light px-4 mb-2">
                    Inventory Management
                  </div>
                  <div>
                    <Button
                      className="px-4 py-0 mb-2 font-bold text-base h-auto"
                      variant="link"
                      onClick={() => router.push("/inventory")}
                    >
                      Inventory Counts
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="px-4 py-0 font-bold text-base h-auto"
                      variant="link"
                      onClick={() => router.push("/signoutsheet")}
                    >
                      Sign Out Tracker
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-light px-4 mb-2">
                    Administration
                  </div>
                  <div>
                    <Button
                      className="px-4 mb-2 font-bold text-base h-auto py-0"
                      variant="link"
                      onClick={() => router.push("/attendance")}
                    >
                      Attendance
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="px-4 mb-2 font-bold text-base h-auto py-0"
                      variant="link"
                      onClick={() => router.push("/forms")}
                    >
                      Forms
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="px-4 font-bold text-base h-auto py-0"
                      variant="link"
                      onClick={() => router.push("/members")}
                    >
                      Member List
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <Button
                    className="text-sm font-light px-4 mb-2 text-red-600"
                    variant="link"
                    onClick={() => {
                      SignOut();
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
