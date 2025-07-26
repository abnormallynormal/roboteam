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
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Form Management</div>
        <div className="mb-8">
          Track and collect forms and payments from members.
        </div>
        <div className="grid grid-cols-[2fr_7fr] gap-6">
          <Card className="h-fit gap-3">
            <div className="font-semibold mx-4 mb-2 text-xl">Select form</div>
            {documents.map((document) => (
              <div className="flex items-center mx-4" key={document._id}>
                <File />
                <Button
                  value={document.name}
                  className="justify-self-start"
                  variant="link"
                  onClick={() => {
                    setDisplay(document);
                    setSwitchDetector(!switchDetector);
                    console.log(document);
                  }}
                >
                  {document.name}
                </Button>
              </div>
            ))}
          </Card>
          <Card className="overflow-x-auto">
            <div className="font-semibold text-xl mx-4 relative">
              <div>Responses</div>
              <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className=" absolute top-0 right-0"
                  >
                    <Plus />
                    Add new form tracker
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full">
                  <DialogTitle className="mb-4">
                    Add new form tracker
                  </DialogTitle>
                  <AddForm handleSubmit={() => {
                    setSwitchDetector(!switchDetector)
                    setDialog(false)
                  }} />
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
