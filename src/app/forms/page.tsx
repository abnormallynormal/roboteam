"use client";
import Navbar from "@/components/Navigation";
import { Plus, File } from "lucide-react";
import AddForm from "@/components/add-form";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function Forms() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [switchDetector, setSwitchDetector] = useState(false);
  const [display, setDisplay] = useState<any>(null);
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/forms`);
      const data = await result.json();
      console.log(data);
      const temp: any[] = [];
      data.forEach((document: any) => {
        temp.push({
          _id: document._id,
          name: document.name,
          cols: document.cols,
          responses: document.responses,
        });
      });
      console.log(temp);
      setDocuments(temp);
    };
    fetchData();
  }, [switchDetector]);

  return (
    <div>
      <Navbar />
      <div className="mx-6 md:mx-24 py-16">
        <div className="text-2xl md:text-3xl font-bold my-2">
          Form Management
        </div>
        <div className="mb-8 text-sm md:text-base">
          Track and collect forms and payments from members.
        </div>
        <div className="grid grid-rows-[auto_1fr] lg:grid lg:grid-cols-[2fr_7fr] gap-4 md:gap-6">
          {/* Mobile Layout */}
          <div className="grid grid-cols-[1fr_auto] gap-4 sm:hidden">
            <div className="min-w-0 flex-1">
              <Select
                value={display?._id || ""}
                onValueChange={(value) => {
                  const selectedDocument = documents.find(
                    (doc) => doc._id === value
                  );
                  if (selectedDocument) {
                    setDisplay(selectedDocument);
                    setSwitchDetector(!switchDetector)
                  }
                }}
              >
                <SelectTrigger className="w-full min-w-0">
                  <div className="truncate min-w-0 flex-1 text-left">
                    {display?.name || "Select form"}
                  </div>
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  {documents.map((document) => (
                    <SelectItem key={document._id} value={document._id}>
                      <div className="truncate max-w-[250px]">
                        {document.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={dialog} onOpenChange={setDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full">
                <DialogTitle className="mb-4">Add new form tracker</DialogTitle>
                <AddForm
                  handleSubmit={() => {
                    setSwitchDetector(!switchDetector);
                    setDialog(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Sidebar */}
          <Card className="h-fit gap-1 hidden sm:block">
            <div className="font-semibold mx-4 mb-2 text-lg md:text-xl">
              Select form
            </div>
            {documents.map((document) => (
              <div className="mx-4 mb-2" key={document._id}>
                <div className="flex gap-3">
                  <File className=" mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center">
                    <Button
                      value={document.name}
                      className="text-left whitespace-normal h-auto p-0 w-full justify-start"
                      variant="link"
                      onClick={() => {
                        setDisplay(document);
                        setSwitchDetector(!switchDetector);
                      }}
                    >
                      <div className="">{document.name}</div>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card>
          {/* Main Content */}
          <Card className="overflow-x-auto">
            <div className="font-semibold text-lg md:text-xl mx-4 flex flex-row items-start justify-between">
              <div>{display?.name ? `Responses for ${display.name}` : ""}</div>
              <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogTrigger asChild className="hidden sm:flex">
                  <Button variant="secondary">
                    <Plus />
                    Add new form tracker
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full">
                  <DialogTitle className="mb-4">
                    Add new form tracker
                  </DialogTitle>
                  <AddForm
                    handleSubmit={() => {
                      setSwitchDetector(!switchDetector);
                      setDialog(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="mx-4">
              {display === null ? (
                <div className="text-center self-center">No form selected</div>
              ) : (
                <div className="w-full">
                  <DataTable
                    columns={columns(
                      display._id,
                      () => {
                        setSwitchDetector(!switchDetector);
                      },
                      display.cols
                    )}
                    data={display.responses.map((response: any) => ({
                      id: response.id,
                      name: response.name,
                      team: response.team,
                      memberResponses: response.memberResponses,
                    }))}
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
