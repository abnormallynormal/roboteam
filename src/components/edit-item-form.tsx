import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ObjectId } from 'mongodb';
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
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Invalid amount" })
    .refine((val) => Number(val) >= 0.01, { message: "Amount must be at least 0." }),
  description: z.string().min(0, {
    message: "Description must be at least 0 characters.",
  }),
});

const category = [
  { value: "Food", label: "Food" },
  { value: "Clothes", label: "Clothes" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];
interface AddItemFormProps {
  collection: string;
  team: string;
  id: string | undefined;
  name: string | undefined;
  categoryP: string | undefined;
  amount: number | undefined;
  description: string | undefined;
  onItemAdded?: () => void;
}

export default function EditItemForm({
  collection,
  team,
  id,
  name,
  categoryP,
  amount,
  description,
  onItemAdded,
}: AddItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      category: categoryP,
      amount: amount?.toString(),
      description: description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/add-inventory-item`, {
        method: "PATCH",
        body: JSON.stringify({
          collection: collection,
          team: team,
          id: id,
          name: values.name,
          category: values.category,
          amount: values.amount,
          description: values.description
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      onItemAdded?.();
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Item name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name of item" {...field} />
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
              <FormLabel className="text-sm">Category</FormLabel>
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
                      <CommandInput placeholder="Search category..." />
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter an amount"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
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
              <FormLabel className="text-sm">Notes (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add some notes"
                  className="text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4">
          Edit item
        </Button>
      </form>
    </Form>
  );
}
