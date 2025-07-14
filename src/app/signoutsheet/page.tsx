import Navbar from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {borrowedColumns, BorrowedItem} from "./tablecomponents/borrowedcolumns"
import {returnedColumns, ReturnedItem} from "./tablecomponents/returnedcolumns"
import { BorrowedTable } from "./tablecomponents/borrowedtable";
import {ReturnedTable} from "./tablecomponents/returnedtable";
export default function SignInOutTracking() {
  const data = {
    "borrowedItems": [
      {
        borrowerName: "John Doe",
        borrowerTeam: "Team A",
        borrowedItem: "Robot Arm",
        quantity: 1,
        missing: 1,
        borrowedDate: "2023-10-01"
      },
      {
        borrowerName: "Jane Smith",
        borrowerTeam: "Team B",
        borrowedItem: "Sensor Kit",
        quantity: 2,
        missing: 1,
        borrowedDate: "2023-10-02"
      }
    ],
    "returnedItems": [
      {
        returnerName: "John Doe",
        returnerTeam: "Team A",
        returnedItem: "Robot Arm",
        quantity: 1,
        returned: 1,
        returnedDate: "2023-10-01"
      },
      {
        returnerName: "Jane Smith",
        returnerTeam: "Team B",
        returnedItem: "Sensor Kit",
        quantity: 2,
        returned: 1,
        returnedDate: "2023-10-02"
      }
    ]
  }
  return (
    <div>
      <Navbar />
      <div className="px-16 py-4">
        <div className="text-3xl font-bold my-2">Sign Out Sheet</div>
        <div className="mb-8">Track borrowed game elements and tools</div>
        <Tabs defaultValue="borrowed">
            <TabsList className="w-full h-10 mb-4">
                <TabsTrigger value="borrowed">Borrowed Items</TabsTrigger>
                <TabsTrigger value="returned">Returned Items</TabsTrigger>
            </TabsList>
            <TabsContent value="borrowed">
                <BorrowedTable columns={borrowedColumns} data={data.borrowedItems}/>
            </TabsContent>
            <TabsContent value="returned">
                <ReturnedTable columns={returnedColumns} data={data.returnedItems}/>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
