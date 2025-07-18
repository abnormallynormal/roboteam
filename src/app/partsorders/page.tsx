"use client";
import Navbar from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PendingDataTable } from "./partsorderscomponents/pending-data-table";
import { IncomingDataTable } from "./partsorderscomponents/incoming-data-table";
import { ArrivedDataTable } from "./partsorderscomponents/arrived-data-table";
import { PartOrder, columns } from "./partsorderscomponents/column";
import {
  ArrivedPartOrder,
  arrivedColumns,
} from "./partsorderscomponents/arrived-column";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
const data = [
  {
    partName: "1x2x1x35 Aluminum C-Channel (6-pack) ",
    quantity: 5,
    price: 5,
    totalPrice: 5,
    teamsRequesting: "x",
    link: "https://www.vexrobotics.com/channel.html",
    partNumber: "339-3",
  },
  // ...
];
export default function PartsOrders() {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        console.log(text);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="px-16 py-4">
        <div className="text-3xl font-bold my-2">Parts Orders</div>
        <div className="mb-8">Track pending parts orders</div>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full h-10 mb-4">
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Orders</TabsTrigger>
            <TabsTrigger value="arrived">Arrived Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card className="p-4">
              <div className="grid grid-cols-2">
                <div className="font-semibold text-2xl ml-1">
                  Pending Orders
                </div>
                <div className="justify-self-end">
                  <Button>
                    <label>
                      <input
                        type="file"
                        name="hi"
                        className="hidden"
                        onChange={(e) => handleUpload(e)}
                      />
                      Add Orders (Upload CSV File)
                    </label>
                  </Button>
                </div>
              </div>
              <PendingDataTable columns={columns} data={data} />
            </Card>
          </TabsContent>
          <TabsContent value="incoming">
            <Card className="p-4">
              <div className="font-semibold text-2xl ml-1">Incoming Orders</div>
              <IncomingDataTable columns={columns} data={data} />
            </Card>
          </TabsContent>
          <TabsContent value="arrived">
            <Card className="p-4">
              <div className="font-semibold text-2xl ml-1">Arriving Orders</div>
              <IncomingDataTable columns={arrivedColumns} data={data} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
