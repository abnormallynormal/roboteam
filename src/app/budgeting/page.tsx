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
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Budgeting</div>
        <div className="mb-8">
          Track expenses, manage budget, and monitor financial health.
        </div>
        {/* <div className="text-2xl font-semibold mb-4">Your budget at a glance</div>
        <div className="grid grid-cols-4 gap-8 mb-4">
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Current balance</div>
                <div className="font-bold text-3xl">
                  {new Intl.NumberFormat("us-US", {
                    style: "currency",
                    currency: "CAD",
                  }).format(balance)}
                </div>
                <div className="mt-1 text-sm">Available to spend</div>
              </div>
              <div>
                <DollarSign />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Total budget</div>
                <div className="font-bold text-3xl">{budget}</div>
                <div className="mt-1 text-sm">Annual allocation</div>
              </div>
              <div>
                <DollarSign />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Total revenue</div>
                <div className="font-bold text-3xl">
                  {new Intl.NumberFormat("us-US", {
                    style: "currency",
                    currency: "CAD",
                  }).format(revenue)}
                </div>
                <div className="mt-1 text-sm">From sponsors and grants</div>
              </div>
              <div>
                <TrendingUp className="text-green-700" />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid grid-cols-[5fr_1fr]">
              <div>
                <div className="mb-1">Total expenses</div>
                <div className="font-bold text-3xl">
                  {new Intl.NumberFormat("us-US", {
                    style: "currency",
                    currency: "CAD",
                  }).format(expense)}
                </div>
                <div className="mt-1 text-sm">0% of budget</div>
              </div>
              <div>
                <TrendingDown className="text-red-700" />
              </div>
            </div>
          </Card>
        </div> */}
        <div className="text-2xl font-semibold mt-8 mb-4">Transactions</div>
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
