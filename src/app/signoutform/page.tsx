"use client";
import React from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function SignOutForm() {
  const itemSchema = z.object({
    type: z.string().min(1, { message: "Please select an item type" }),
    name: z.string().min(1, { message: "Please select an item" }),
    quantity: z
      .number({ invalid_type_error: "Quantity is required" })
      .min(1, { message: "Please enter a positive value" })
      .refine((val) => !Number.isNaN(val), { message: "Quantity is required" }),
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
    items: z
      .array(itemSchema)
      .min(1, { message: "Please enter at least one item" })
      .max(10, { message: "Please enter at most ten items at a time" }),
  });
  const signInFormSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    items: z
      .array(returnSchema)
      .min(1, { message: "Please enter at least one item" })
      .max(10, { message: "Please enter at most ten items at a time" }),
  });
  const formSignout = useForm<z.infer<typeof signOutFormSchema>>({
    resolver: zodResolver(signOutFormSchema),
    defaultValues: {
      email: "",
      items: [{ type: "", name: "", quantity: NaN }],
    },
  });
  const formSignin = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
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
  const items = [
    {
      value: "1",
      label: "Evan Ding: Gooned to a file",
    },
    {
      value: "2",
      label: "Kevin He: Ate a big mac",
    },
  ];
  // 2. Define a submit handler.
  function signOut(values: z.infer<typeof signOutFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  function signIn(values: z.infer<typeof signInFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
                    className="space-y-8"
                  >
                    <FormField
                      control={formSignout.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-4 mb-6">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="team@robotics.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {signOutFields.map((field, index) => {
                      return (
                        <div key={index}>
                          <div className="my-2 font-bold">Item {index + 1}</div>
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
                        className="w-full"
                        onClick={() => appendSignOut({ type: "", name: "", quantity: NaN })}
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
                    className="space-y-8"
                  >
                    <FormField
                      control={formSignin.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-4 mb-6">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="team@robotics.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                                              ? items.find(
                                                  (item) =>
                                                    item.value === field.value
                                                )?.label
                                              : "Select item"}
                                            <ChevronsUpDown className="opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className=" p-0">
                                        <Command>
                                          <CommandInput
                                            placeholder="Search for a borrowed item..."
                                            className="h-9"
                                          />
                                          <CommandList>
                                            <CommandEmpty>
                                              No item found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {items.map((item) => (
                                                <CommandItem
                                                  value={item.value}
                                                  key={item.value}
                                                  onSelect={() => {
                                                    formSignin.setValue(
                                                      `items.${index}.item`,
                                                      item.value
                                                    );
                                                  }}
                                                >
                                                  {item.label}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      item.value === field.value
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
                        className="w-full"
                        onClick={() => appendSignIn({ item: "", returnQuantity: NaN })}
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
