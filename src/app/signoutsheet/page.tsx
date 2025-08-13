"use client";
import Navbar from "@/components/Navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  borrowedColumns,
  BorrowedItem,
} from "./tablecomponents/borrowedcolumns";
import {
  returnedColumns,
  ReturnedItem,
} from "./tablecomponents/returnedcolumns";
import { BorrowedTable } from "./tablecomponents/borrowedtable";
import { ReturnedTable } from "./tablecomponents/returnedtable";
export default function SignInOutTracking() {
  const [switchDetector, setSwitchDetector] = useState(false);
  const [toBeReturned, setToBeReturned] = useState<BorrowedItem[]>([]);
  const [returned, setReturned] = useState<ReturnedItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/signout`);
      const data = await result.json();
      console.log(data);
      const temp: any[] = [];
      const tempTBR: any[] = [];
      const tempRI: any[] = [];
      data.forEach((document: any) => {
        temp.push({
          value: document._id,
          borrowerName: document.email,
          borrowerTeam: document.team,
          borrowedItem: document.item,
          quantity: document.initial,
          missing: document.remaining,
          borrowedDate: document.date.toString().substring(0, 10),
        });
        if (document.remaining > 0) {
          tempTBR.push({
            value: document._id,
            borrowerName: document.email,
            borrowerTeam: document.team,
            borrowedItem: document.item,
            quantity: document.initial,
            missing: document.remaining,
            borrowedDate: document.date.toString().substring(0, 10),
          });
        }
        if (document.initial > document.remaining) {
          tempRI.push({
            value: document._id,
            returnerName: document.email,
            returnerTeam: document.team,
            returnedItem: document.item,
            quantity: document.initial,
            returned: document.initial - document.remaining,
            returnedDate: document.date.toString().substring(0, 10),
          });
        }
      });
      console.log(tempTBR);
      console.log(temp);
      console.log(tempRI);
      setToBeReturned(tempTBR);
      setReturned(tempRI);
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />
      <div className="mx-6 md:mx-24 py-16">
        <div className="text-2xl md:text-3xl font-bold my-2">Sign Out Sheet</div>
        <div className="mb-8 text-sm md:text-base">Track borrowed game elements and tools</div>
        <Tabs defaultValue="borrowed">
          <TabsList className="w-full h-10 mb-4">
            <TabsTrigger value="borrowed">Borrowed Items</TabsTrigger>
            <TabsTrigger value="returned">Returned Items</TabsTrigger>
          </TabsList>
          <TabsContent value="borrowed">
            <BorrowedTable
              columns={borrowedColumns(() => {
                setSwitchDetector(!switchDetector);
              })}
              data={toBeReturned}
            />
          </TabsContent>
          <TabsContent value="returned">
            <ReturnedTable columns={returnedColumns} data={returned} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
