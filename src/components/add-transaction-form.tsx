import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Check, ChevronsUpDown } from "lucide-react";

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


const category = [
  { label: "Parts Orders", value: "Parts Orders" },
  { label: "Tournament Fees", value: "Tournament Fees" },
  { label: "Food", value: "Food" },
  { label: "Sponsorships", value: "Sponsorships" },
  { label: "Grants", value: "Grants" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];

const type = [
    {
        value: "Revenue",
        label: "Revenue"
    },
    {
        value: "Expense",
        label: "Expense"
    },
]
interface AddTransactionFormProps {
  onItemAdded?: () => void;
}

export default function AddTransactionForm({
  onItemAdded,
}: AddTransactionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      description: "",
      amount: undefined,
      category: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      if (response.status === 200) {
        onItemAdded?.();
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1">Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2"
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="Revenue" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Revenue
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="Expense" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Expense
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
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
                <Input placeholder="What was purchased/received?" {...field} />
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
                      e.target.value === "" ? undefined : Number(e.target.value)
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
              <FormDescription>
                To add a category, double click the category header
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
