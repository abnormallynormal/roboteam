"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ObjectId } from "mongodb";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

const remaining = [
  { type: "Blocks", max: 3 },
  { type: "Loaders", max: 2 },
];

const maxValues = [
  {
    type: "Blocks",
    max: 4,
  },
  {
    type: "Loaders",
    max: 2,
  },
];
export default function SignOutForm() {
  const itemSchema = z
    .object({
      type: z.string().min(1, { message: "Please select an item type" }),
      name: z.string().min(1, { message: "Please select an item" }),
      quantity: z
        .number({ invalid_type_error: "Quantity is required" })
        .min(1, { message: "Please enter a positive value" })
        .refine((val) => !Number.isNaN(val), {
          message: "Quantity is required",
        }),
    })
    .superRefine((data, ctx) => {
      const foundItem = maxValues.find((item) => item.type === data.name);
      if (foundItem && data.quantity > foundItem.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `You cannot borrow more than ${foundItem.max} of ${data.name} at a time`,
          path: ["quantity"], // This explicitly targets the quantity field
        });
      }
      const itemRemaining = remaining.find((item) => item.type === data.name);
      if (itemRemaining && data.quantity > itemRemaining.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `The maximum number of ${data.name} you can borrow at the moment is ${itemRemaining.max}`,
          path: ["quantity"], // This explicitly targets the quantity field
        });
      }
    });
  const returnSchema = z.object({
    item: z.string().min(1, { message: "Please select an item to return" }),
    returnQuantity: z
      .number({ invalid_type_error: "Quantity is required" })
      .min(1, { message: "Please enter a positive value" })
      .refine((val) => !Number.isNaN(val), { message: "Quantity is required" }),
  });
  const signOutFormSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    team: z.string().min(1, { message: "Please select a team." }),
    items: z
      .array(itemSchema)
      .min(1, { message: "Please enter at least one item" })
      .max(10, { message: "Please enter at most ten items at a time" }),
  });
  const signInFormSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    team: z.string().min(1, { message: "Please select a team." }),

    items: z
      .array(returnSchema)
      .min(1, { message: "Please enter at least one item" })
      .max(10, { message: "Please enter at most ten items at a time" }),
  });
  const formSignout = useForm<z.infer<typeof signOutFormSchema>>({
    resolver: zodResolver(signOutFormSchema),
    defaultValues: {
      email: "",
      team: "",
      items: [{ type: "", name: "", quantity: NaN }],
    },
  });
  const formSignin = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      team: "",

      items: [{ item: "", returnQuantity: NaN }],
    },
  });
  // For sign out form
  const {
    fields: signOutFields,
    append: appendSignOut,
    remove: removeSignOut,
  } = useFieldArray({
    name: "items",
    control: formSignout.control,
  });

  // For sign in form
  const {
    fields: signInFields,
    append: appendSignIn,
    remove: removeSignIn,
  } = useFieldArray({
    name: "items",
    control: formSignin.control,
  });
  const teams = ["82855G", "82855S", "82855T", "82855X", "82855Y", "82855Z"];
  const [switchDetector, setSwitchDetector] = useState(false);
  const [dataset, setDataset] = useState([
    {
      value: "",
      label: {
        email: "",
        team: "",
        date: "",
        item: 0,
        initialQ: 0,
        remainingQ: 0,
      },
      display: "",
    },
  ]);
  const [toBeReturned, setToBeReturned] = useState([
    {
      value: "",
      label: {
        email: "",
        team: "",
        date: "",
        item: 0,
        initialQ: 0,
        remainingQ: 0,
      },
      display: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/signout`);
      const data = await result.json();
      console.log(data);
      const temp: any[] = [];
      const tempTBR: any[] = [];
      data.forEach((document: any) => {
        temp.push({
          value: document._id,
          label: {
            email: document.email,
            team: document.team,
            date: document.date,
            item: document.item,
            initialQ: document.initial,
            remainingQ: document.remaining,
          },
          display: `${document.email} - ${document.team}: ${document.item} (${document.remaining})`,
        });
        if (document.remaining > 0) {
          tempTBR.push({
            value: document._id,
            label: {
              email: document.email,
              team: document.team,
              date: document.date,
              item: document.item,
              initialQ: document.initial,
              remainingQ: document.remaining,
            },
            display: `${document.email} - ${document.team}: ${document.item} (${document.remaining})`,
          });
        }
      });
      console.log(temp);
      setDataset(temp);
      setToBeReturned(tempTBR);
    };
    fetchData();
  }, [switchDetector]);

  async function signOut(values: z.infer<typeof signOutFormSchema>) {
    var email = values.email;
    var team = values.team;
    for (var i = 0; i < values.items.length; i++) {
      var item = values.items[i];
      try {
        const response = await fetch(`/api/signout`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            team: team,
            date: new Date().toISOString(),
            item: item.name,
            initial: item.quantity,
            remaining: item.quantity,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        formSignout.reset({
          email: "",
          items: [{ type: "", name: "", quantity: NaN }],
        });
        setSwitchDetector((prev) => !prev);
      } catch (err) {
        console.error("Error submitting transaction:", err);
      }
    }
    console.log(values);
  }
  async function signIn(values: z.infer<typeof signInFormSchema>) {
    var email = values.email;
    var team = values.team;
    for (var i = 0; i < values.items.length; i++) {
      var item = values.items[i];
      try {
        const response = await fetch(`/api/signout`, {
          method: "PATCH",
          body: JSON.stringify({
            email: email,
            team: team,
            item: item.item,
            originalQuantity: dataset.find((data) => data.value === item.item)
              ?.label.remainingQ,
            returnQuantity: item.returnQuantity,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        formSignin.reset({
          email: "",
          items: [{ item: "", returnQuantity: NaN }],
        });
        setSwitchDetector((prev) => !prev);
      } catch (err) {
        console.error("Error submitting transaction:", err);
      }
    }
    console.log(values);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        {/* <div className="mb-4">
          <Button variant="ghost">
            <ChevronLeftIcon />
            Back to Home
          </Button>
        </div> */}
        <div className="justify-self-center mt-12 text-3xl font-bold">
          STL Robotics Sign Out Form
        </div>
        <div>
          <Card className="relative w-3/4 justify-self-center py-4 px-8 m-24 mt-12">
            <Tabs
              defaultValue="signout"
              className="w-auto flex justify-self-center"
            >
              <TabsList className="mb-2 flex justify-self-center w-full">
                <TabsTrigger value="signout">Sign Out Item</TabsTrigger>
                <TabsTrigger value="signin">Sign In Item</TabsTrigger>
              </TabsList>
              <TabsContent value="signout" className="m-0">
                <Form {...formSignout}>
                  <form
                    onSubmit={formSignout.handleSubmit(signOut)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formSignout.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="team@robotics.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSignout.control}
                        name="team"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Team</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? teams.find(
                                            (data) => data === field.value
                                          )
                                        : "Select team"}
                                      <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                                  <Command>
                                    <CommandInput
                                      placeholder="Search for a team..."
                                      className="h-9"
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        No teams found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {teams.map((team) => (
                                          <CommandItem
                                            value={team}
                                            key={team}
                                            onSelect={() => {
                                              formSignout.setValue(
                                                "team",
                                                team
                                              );
                                              field.value = team;
                                            }}
                                          >
                                            {team}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                team === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {signOutFields.map((field, index) => {
                      return (
                        <div key={index}>
                          {index !== 0 ? (
                            <div className="flex mb-1 gap-1">
                              <div className="self-center font-bold">
                                Item {index + 1}
                              </div>
                              <Button
                                type="button"
                                className="!text-red-500 justify-items-end items-center "
                                size="icon"
                                variant="ghost"
                                onClick={() => removeSignOut(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          ) : (
                            <div className="mb-2 font-bold">
                              Item {index + 1}
                            </div>
                          )}

                          <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
                            <FormField
                              control={formSignout.control}
                              name={`items.${index}.type`}
                              render={({ field }) => (
                                <FormItem className="my-2">
                                  <FormLabel>Type</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Game Element"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formSignout.control}
                              name={`items.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="my-2">
                                  <FormLabel>Item Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Red Blocks"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formSignout.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="my-2">
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="2"
                                      type="number"
                                      {...field}
                                      value={
                                        field.value === undefined ||
                                        Number.isNaN(field.value)
                                          ? ""
                                          : field.value
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          appendSignOut({ type: "", name: "", quantity: NaN })
                        }
                      >
                        Add Item
                      </Button>
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signin">
                <Form {...formSignin}>
                  <form
                    onSubmit={formSignin.handleSubmit(signIn)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={formSignin.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="team@robotics.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSignin.control}
                        name="team"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Team</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? teams.find(
                                            (data) => data === field.value
                                          )
                                        : "Select team"}
                                      <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                                  <Command>
                                    <CommandInput
                                      placeholder="Search for a team..."
                                      className="h-9"
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        No teams found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {teams.map((team) => (
                                          <CommandItem
                                            value={team}
                                            key={team}
                                            onSelect={() => {
                                              formSignin.setValue("team", team);
                                              field.value = team;
                                            }}
                                          >
                                            {team}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                team === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {signInFields.map((field, index) => {
                      return (
                        <div key={index}>
                          <div className="my-2 font-bold">Item {index + 1}</div>
                          <div className="grid grid-cols-[2fr_1fr] gap-4">
                            <FormField
                              control={formSignin.control}
                              name={`items.${index}.item`}
                              render={({ field }) => (
                                <FormItem className="my-2">
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              "w-full justify-between font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value
                                              ? dataset.find(
                                                  (data) =>
                                                    data.value === field.value
                                                )?.display
                                              : "Select item"}
                                            <ChevronsUpDown className="opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                                        <Command>
                                          <CommandInput
                                            placeholder="Search for a borrowed item..."
                                            className="h-9"
                                          />
                                          <CommandList>
                                            <CommandEmpty>
                                              No items currently signed out.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {toBeReturned.map((data) => (
                                                <CommandItem
                                                  value={data.value}
                                                  key={data.value}
                                                  onSelect={() => {
                                                    formSignin.setValue(
                                                      `items.${index}.item`,
                                                      data.value
                                                    );
                                                  }}
                                                >
                                                  {data.display}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      data.value === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formSignin.control}
                              name={`items.${index}.returnQuantity`}
                              render={({ field }) => (
                                <FormItem className="my-2">
                                  <FormLabel>Quantity Being Returned</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="2"
                                      type="number"
                                      {...field}
                                      value={
                                        field.value === undefined ||
                                        Number.isNaN(field.value)
                                          ? ""
                                          : field.value
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          appendSignIn({ item: "", returnQuantity: NaN })
                        }
                      >
                        Add Item
                      </Button>
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
