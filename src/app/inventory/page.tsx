"use client";
import Navbar from "@/components/Navigation";
import { Plus, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { columns, Item } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function Inventory() {
  const [collections, setCollections] = useState<any[]>([]);
  const [switchDetector, setSwitchDetector] = useState(false);
  const [display, setDisplay] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState("g-team");

  const formSchema = z
    .object({
      name: z.string().min(1, {
        message: "Name must be at least 1 character.",
      }),
      defaultItemsChecked: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        collections.find(
          (collection) => collection.collectionName === data.name
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Collection already exists",
          path: ["name"],
        });
      }
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      defaultItemsChecked: "true",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/inventory`, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          defaultItems: values.defaultItemsChecked,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSwitchDetector(!switchDetector);
      form.reset();
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/inventory`);
      const data = await result.json();
      const temp: any[] = [];
      console.log(data);
      Object.entries(data).forEach((collection: any) => {
        temp.push({
          collectionName: collection[0],
          items: collection[1],
        });
      });
      setCollections(temp);

      if (display) {
        setDisplay(
          temp.find((col) => col.collectionName === display.collectionName)
        );
      }
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />
      <div className="mx-6 md:mx-24 py-16">
        <div className="text-2xl md:text-3xl font-bold my-2">
          Inventory Management
        </div>
        <div className="mb-8 text-sm md:text-base">
          Track parts, components, and equipment for your team.
        </div>
        <div className="grid grid-rows-[auto_1fr] lg:grid lg:grid-cols-[2fr_7fr] gap-4 md:gap-6">
          <div className="grid grid-cols-[1fr_auto] gap-4 sm:hidden">
            <Select
              value={display?.collectionName || ""}
              onValueChange={(value) => {
                const selectedCollection = collections.find(
                  (c) => c.collectionName === value
                );
                if (selectedCollection) {
                  setDisplay(selectedCollection);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select inventory count" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem
                    key={collection.collectionName}
                    value={collection.collectionName}
                  >
                    {collection.collectionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2">
                            Name of new inventory count
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Inventory September 2025"
                              {...field}
                              className="text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultItemsChecked"
                      render={({ field }) => (
                        <FormItem className="flex">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "true"}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange("true")
                                  : field.onChange("false");
                              }}
                            />
                          </FormControl>
                          <FormLabel className="">
                            Add default inventory items?
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </div>
          <Card className="h-fit  hidden sm:block">
            <div className="font-semibold mx-4 mb-2 text-xl">
              Select inventory count
            </div>
            {collections.map((collection) => (
              <div
                className="flex items-center mx-4 gap-3 mb-1"
                key={collection.collectionName}
              >
                <File className=" mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex items-center">
                  <Button
                    value={collection.collectionName}
                    className="text-left whitespace-normal h-auto p-0 w-full justify-start"
                    variant="link"
                    key={collection.collectionName}
                    onClick={() => {
                      setDisplay(collection);
                    }}
                  >
                    {collection.collectionName}
                  </Button>
                </div>
              </div>
            ))}
          </Card>
          <Card className="overflow-x-auto">
            <div className="font-semibold text-lg md:text-xl mx-4 flex flex-row items-start justify-between">
              <div>{display?.collectionName || ""}</div>
              <Popover>
                <PopoverTrigger asChild className="hidden sm:flex">
                  <Button variant="secondary">
                    <Plus />
                    Add new inventory count
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-2">
                              Name of new inventory count
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Inventory September 2025"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="defaultItemsChecked"
                        render={({ field }) => (
                          <FormItem className="flex">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "true"}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange("true")
                                    : field.onChange("false");
                                }}
                              />
                            </FormControl>
                            <FormLabel className="mb-0">
                              Add default inventory items?
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                </PopoverContent>
              </Popover>
            </div>
            <div className="">
              {display === null ? (
                <div className="text-center self-center">
                  No inventory selected
                </div>
              ) : (
                <div className="px-4 py-2 min-w-0">
                  <Tabs
                    value={selectedTeam}
                    onValueChange={setSelectedTeam}
                    className="w-full"
                  >
                    {/* Mobile: Team Select Dropdown */}
                    <div className="block sm:hidden">
                      <Select
                        value={selectedTeam}
                        onValueChange={setSelectedTeam}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g-team">82855G</SelectItem>
                          <SelectItem value="s-team">82855S</SelectItem>
                          <SelectItem value="t-team">82855T</SelectItem>
                          <SelectItem value="x-team">82855X</SelectItem>
                          <SelectItem value="y-team">82855Y</SelectItem>
                          <SelectItem value="z-team">82855Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desktop: Regular Tabs */}
                    <TabsList className="w-full hidden sm:flex">
                      <TabsTrigger value="g-team">82855G</TabsTrigger>
                      <TabsTrigger value="s-team">82855S</TabsTrigger>
                      <TabsTrigger value="t-team">82855T</TabsTrigger>
                      <TabsTrigger value="x-team">82855X</TabsTrigger>
                      <TabsTrigger value="y-team">82855Y</TabsTrigger>
                      <TabsTrigger value="z-team">82855Z</TabsTrigger>
                    </TabsList>

                    {display?.items?.map((team: any) => (
                      <TabsContent value={team.team} key={team.team}>
                        <div className="mt-4">
                          <DataTable
                            key={`${display.collectionName}-${team.team}`}
                            collection={display.collectionName}
                            team={team.team}
                            columns={columns(
                              display.collectionName,
                              team.team,
                              () => setSwitchDetector(!switchDetector)
                            )}
                            onItemAdded={() =>
                              setSwitchDetector(!switchDetector)
                            }
                            data={team.items.map((item: any) => ({
                              id: item.id,
                              name: item.name,
                              category: item.category,
                              amount: item.amount,
                              description: item.description,
                            }))}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}
            </div>
            <div className="mx-4"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
