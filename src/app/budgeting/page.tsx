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
import { columns, Transaction } from "./columns";
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

export default function Budgeting() {
  const [switchDetector, setSwitchDetector] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [budget, setBudget] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/transactions/{transactionId}`);
      const data = await result.json();
      const temp: Transaction[] = [];

      data.forEach((transaction: any) => {
        temp.push({
          _id: transaction._id,
          type: transaction.type,
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
        });
      });
      setTransactions(temp);
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Budgeting</div>
        <div className="mb-8">
          Track expenses, manage budget, and monitor financial health.
        </div>
        <div className="relative">
          <DataTable
            columns={columns("yourCollection", "yourTeam", () => setSwitchDetector(!switchDetector))}
            data={transactions} 
          />
        </div>
      </div>
    </div>
  );
}
