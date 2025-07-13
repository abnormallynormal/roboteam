import Navbar from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignInOutTracking() {
  return (
    <div>
      <Navbar />
      <div className="px-16 py-4">
        <div className="text-3xl font-bold my-2">Signed Out Items</div>
        <div className="mb-8">Track pending parts orders</div>
        <Tabs>
            <TabsList className="w-full h-10 mb-4">
                <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                <TabsTrigger value="incoming">Incoming Orders</TabsTrigger>
                <TabsTrigger value="arrived">Arrived Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
                {/* Pending Orders Content */}
            </TabsContent>
            <TabsContent value="incoming">
                {/* Incoming Orders Content */}
            </TabsContent>
            <TabsContent value="arrived">
                {/* Arrived Orders Content */}
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
