"use client";
import Navbar from "@/components/Navigation";
import { Plus, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  AlteredTabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import { columns, Payment } from "./columns";
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

export default function Forms() {
  const [documents, setDocuments] = useState<any[]>([]);
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
      const response = await fetch(`/api/payments`, {
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
      const result = await fetch(`/api/payments`);
      const data = await result.json();
      const temp: any[] = [];
      data.forEach((document: any) => {
        temp.push({
          _id: document._id,
          name: document.name,
          date: document.date,
          responses: document.responses,
        });
      });
      console.log(temp);
      setDocuments(temp);

      // if (display) {
      //   setDisplay(
      //     temp.find((col) => col.collectionName === display.collectionName)
      //   );
      // }
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Payment Management</div>
        <div className="mb-8">
          Track and collect payments and fees from members.
        </div>
        <div className="grid grid-cols-[2fr_7fr] gap-6">
          <Card className="h-fit gap-3">
            <div className="font-semibold mx-4 mb-2 text-xl">
              Select payment form
            </div>
            {documents.map((document) => (
              <div className="flex items-center mx-4" key={document.name}>
                <File />
                <Button
                  value={document.name}
                  className="justify-self-start"
                  variant="link"
                  onClick={() => {
                    setDisplay(document);
                    setSwitchDetector(!switchDetector);
                  }}
                >
                  {document.name}
                </Button>
              </div>
            ))}
          </Card>
          <Card>
            <div className="font-semibold text-xl mx-4 relative">
              <div>Responses</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className=" absolute top-0 right-0"
                  >
                    <Plus />
                    Add new payment form
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
                            <FormLabel>Name of new payment</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Provincials Payment 2026"
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
            <div className="mx-4">
              {display === null ? (
                <div className="text-center self-center">No form selected</div>
              ) : (
                <div>
                  <DataTable
                    columns={columns(display.name, () => {
                      setSwitchDetector(!switchDetector);
                    })}
                    data={
                      display.responses?.map((response: any) => ({
                        id: response._id,
                        name: response.name,
                        team: response.team,
                        amount: response.amount,
                        paid: response.paid,
                      })) || []
                    }
                  />
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