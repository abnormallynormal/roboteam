"use client";
import Navbar from "@/components/Navigation";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  AlteredTabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import { columns, Item } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { AlteredCard } from "@/components/ui/altered-card";
import AddItemForm from "@/components/add-item-form";
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
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
});

export default function Inventory() {
  const [collections, setCollections] = useState<any[]>([]);
  const [switchDetector, setSwitchDetector] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/inventory`, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSwitchDetector(!switchDetector);
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/inventory`);
      const data = await result.json();
      const temp: any[] = [];
      Object.entries(data).forEach((collection: any) => {
        temp.push({
          collectionName: collection[0],
          items: collection[1],
        });
      });
      console.log(temp);
      setCollections(temp);
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Inventory Management</div>
        <div className="mb-8">
          Track parts, components, and equipment for your team.
        </div>
        <div className="relative">
          <Tabs
            defaultValue="Borrowed Items"
            className="gap-0 cols-span-2"
          >
            <AlteredTabsList className="bg-[#F5F5F5] h-full">
              {collections.map((collection) => (
                <TabsTrigger
                  value={collection.collectionName}
                  className="rounded-t-lg"
                  key={collection.collectionName} // Add key here
                >
                  {collection.collectionName}
                </TabsTrigger>
              ))}
            </AlteredTabsList>
            {collections.map((collection) => (
              <TabsContent
                value={collection.collectionName}
                className="cols-span-2"
                key={collection.collectionName} // Add key here
              >
                <AlteredCard className="rounded-br-xl rounded-bl-xl cols-span-2">
                  <div className="px-4 py-2 min-w-0">
                    <Tabs defaultValue="g-team">
                      <TabsList className="bg-[#F5F5F5] w-full">
                        <TabsTrigger value="g-team">82855G</TabsTrigger>
                        <TabsTrigger value="s-team">82855S</TabsTrigger>
                        <TabsTrigger value="t-team">82855T</TabsTrigger>
                        <TabsTrigger value="x-team">82855X</TabsTrigger>
                        <TabsTrigger value="y-team">82855Y</TabsTrigger>
                        <TabsTrigger value="z-team">82855Z</TabsTrigger>
                      </TabsList>
                      {collection.items.map((team: any) => (
                        <TabsContent value={team.team} key={team.team}>
                          <div className="mt-4">
                            <DataTable
                              collection={collection.collectionName}
                              team={team.team}
                              columns={columns(
                                collection.collectionName,
                                team.team,
                                () => setSwitchDetector(!switchDetector)
                              )}
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
                </AlteredCard>
              </TabsContent>
            ))}
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="special" className=" absolute top-0 right-0">
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
                        <FormLabel>Name of new inventory count</FormLabel>
                        <FormControl>
                          <Input placeholder="Inventory September 2025" {...field} />
                        </FormControl>
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
      </div>
    </div>
  );
}
