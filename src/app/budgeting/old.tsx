"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import Calendar18 from "@/components/calendar-18";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const category = [
  { label: "Parts Orders", value: "parts-orders" },
  { label: "Tournament Fees", value: "tournament" },
  { label: "Food", value: "food" },
  { label: "Sponsorships", value: "sponsors" },
  { label: "Grants", value: "grants" },
  { label: "Miscellaneous", value: "misc" },
] as const;

interface Transaction {
  _id: string;
  type: "expense" | "revenue";
  description: string;
  amount: number;
  category: (typeof category)[number]["value"];
  date: string;
}

const formSchema = z.object({
  type: z.string({
    required_error: "Please select a transaction type",
  }),
  description: z.string().min(1, {
    message: "Please enter a description.",
  }),
  amount: z.number().min(0.01, {
    message: "Please enter an amount greater than 0.00.",
  }),
  category: z.string({
    required_error: "Please select a category",
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      description: "",
      amount: undefined,
      category: undefined,
    },
  });
  const onSubmit = async (
    values: z.infer<typeof formSchema>
    // transactionId: string
  ) => {
    try {
      const response = await fetch(`/api/transactions/{id}`, {
        method: "POST",
        body: JSON.stringify({
          type: values.type,
          description: values.description,
          amount: values.amount,
          category: values.category,
          date: new Date().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (values.type === "expense") {
        setExpense((prev) => prev + values.amount);
        setBalance((prev) => prev - values.amount);
      }
      if (values.type === "revenue") {
        setRevenue((prev) => prev + values.amount);
        setBalance((prev) => prev + values.amount);
      }
      console.log(response);
      setSwitchDetector(!switchDetector);
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  };
  return (
    <div className="bg-[#F5F5F5]">
      <div className="bg-[#FFFFFF]">
        <Navbar />
      </div>
      <div className="px-24 py-4">
        <div className="text-3xl font-bold my-2">Budgeting</div>
        <div className="mb-8">
          Track expenses, manage budget, and monitor financial health.
        </div>
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
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-8 mx-24 mb-4">
        <Card>
          <div className="mx-6 mb-0 text-2xl font-bold">Transactions</div>
          <div className="mx-6 grid grid-cols-[1fr_auto] gap-6">
            <Input placeholder="Search for transactions" />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ListFilter className="b-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter transactions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-3 p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855G</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855S</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855T</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855X</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855Y</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">82855Z</Label>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {transactions.map((transaction) => (
            <Card key={transaction._id} className="mx-6 my-1 p-5 gap-1">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                {transaction.type === "revenue" ? (
                  <div className="bg-green-200 rounded-full w-8 h-8 justify-items-center content-center">
                    <TrendingUp className="text-green-700 w-5 h-5" />
                  </div>
                ) : (
                  <div className="bg-red-200 rounded-full w-8 h-8 justify-items-center content-center">
                    <TrendingDown className="text-red-700 w-5 h-5" />
                  </div>
                )}
                <div className="grid grid-rows-2">
                  <div className="text-lg font-semibold">
                    {transaction.description}
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-4 content-center">
                    <div className="text-sm">{transaction.category}</div>
                    <div className="grid grid-cols-[auto_1fr] content-center gap-1 ">
                      <Calendar className="w-4 h-4 place-self-center" />
                      <div className="text-sm">
                        {transaction.date.toString().substring(0, 10)}
                      </div>
                    </div>
                  </div>
                </div>
                {transaction.type === "revenue" ? (
                  <div className="grid grid-rows-2 gap-2 content-center">
                    <div className="font-bold text-xl text-green-700 justify-self-end">
                      +
                      {new Intl.NumberFormat("us-US", {
                        style: "currency",
                        currency: "CAD",
                      }).format(transaction.amount)}
                    </div>
                    <Badge variant="secondary" className="justify-self-end">
                      Revenue
                    </Badge>
                  </div>
                ) : (
                  <div className="grid grid-rows-2 gap-2 content-center">
                    <div className="font-bold text-xl text-red-700 justify-self-end">
                      -
                      {new Intl.NumberFormat("us-US", {
                        style: "currency",
                        currency: "CAD",
                      }).format(transaction.amount)}
                    </div>
                    <Badge variant="secondary" className="justify-self-end">
                      Expense
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </Card>
        <Card className="gap-2">
          <div className="mx-6 text-2xl font-bold">Add Transaction</div>
          <div className="mx-6 mb-4 p-0">Record new revenue or expense</div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-6"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? category.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : "Select category"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search category..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {category.map((category) => (
                                  <CommandItem
                                    value={category.label}
                                    key={category.value}
                                    onSelect={() => {
                                      form.setValue("category", category.value);
                                    }}
                                  >
                                    {category.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        category.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What was purchased/received?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        {...field}
                        value={field.value ?? ""} // Show empty string when undefined
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? category.find(
                                  (category) => category.value === field.value
                                )?.label
                              : "Select category"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {category.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue("category", category.value);
                                  }}
                                >
                                  {category.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      category.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
