"use client";
import Navbar from "@/components/Navigation";
import { Plus, File } from "lucide-react";
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
  const [display, setDisplay] = useState<any>(null);
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
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Inventory Management</div>
        <div className="mb-8">
          Track parts, components, and equipment for your team.
        </div>
        <div className="grid grid-cols-[2fr_7fr] gap-6">
          <Card className="h-fit gap-3">
            <div className="font-semibold mx-4 mb-2 text-xl">
              Select inventory count
            </div>
            {collections.map((collection) => (
              <div className="flex items-center mx-4" key = {collection.collectionName}>
                <File />
                <Button
                  value={collection.collectionName}
                  className="justify-self-start"
                  variant="link"
                  key={collection.collectionName}
                  onClick={() => {
                    setDisplay(collection);
                    setSwitchDetector(!switchDetector);
                  }}
                >
                  {collection.collectionName}
                </Button>
              </div>
            ))}
          </Card>
          <Card className="overflow-x-auto">
            <div className="font-semibold text-xl mx-4 relative">
              <div>Inventory</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="absolute top-0 right-0"
                  >
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
                            <FormLabel className="mb-2">Name of new inventory count</FormLabel>
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
                  <Tabs defaultValue="g-team" className="w-full">
                    <TabsList className="bg-[#F5F5F5] w-full">
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
                            onItemAdded={() => setSwitchDetector(!switchDetector)}
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
