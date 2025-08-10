"use client";
import Navbar from "@/components/Navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { columns, Transaction } from "./columns";
import { DataTable } from "./data-table";
import { z } from "zod";
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
  const [open, setOpen] = useState(false);
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
      <div className="mx-6 md:mx-24 py-16">
        <div className="text-2xl md:text-3xl font-bold my-2">Budgeting</div>
        <div className="mb-8 text-sm md:text-base">
          Track expenses, manage budget, and monitor financial health.
        </div>
        <div className="text-xl md:text-2xl font-semibold mt-8 mb-4">Transactions</div>
        <div className="relative">
          <DataTable
            columns={columns(
              "yourCollection",
              "yourTeam",
              () => setSwitchDetector(!switchDetector),
              () => setOpen(true)
            )}
            data={transactions}
          />
        </div>
        <Dialog
          open={open}
          onOpenChange={() => {
            setOpen(false);
          }}
        >
          <DialogContent>
            <DialogTitle>Edit Categories</DialogTitle>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
