import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
const suppFormSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name must be at least 1 character.",
    }),
    type: z.string().min(1, {
      message: "Please select a type.",
    }),
    amount: z.number().optional(),
  })
  .refine(
    (data) => {
      if (
        data.type === "payment" &&
        (data.amount === undefined ||
          data.amount === null ||
          isNaN(data.amount))
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Amount is required when payment is selected.",
      path: ["amount"],
    }
  );

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name must be at least 1 character.",
    }),
    type: z.string().min(1, {
      message: "Please select a type.",
    }),
    amount: z.number().optional(),
    suppForms: z.array(suppFormSchema),
  })
  .refine(
    (data) => {
      if (
        data.type === "payment" &&
        (data.amount === undefined ||
          data.amount === null ||
          isNaN(data.amount))
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Amount is required when payment is selected.",
      path: ["amount"],
    }
  );

export default function AddForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  const {
    fields: extraFields,
    append: append,
    remove: remove,
  } = useFieldArray({
    name: "suppForms",
    control: form.control,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("hi");
    try {
      const response = await fetch(`/api/payments`, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  }

  return (
    <ScrollArea className="h-auto max-h-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of new form</FormLabel>
                  <FormControl>
                    <Input placeholder="Provincials Payment 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of payment</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" {...field} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Payment">Payment</SelectItem>
                        <SelectItem value="Form">Form</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.watch("type") === "Payment" && (
            <div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {extraFields.map((field, index) => {
            return (
              <FormField
                key={index}
                control={form.control}
                name={`suppForms.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="grid grid-cols-[1fr_auto]">
                      <div>Name of supplemental form {index + 1}</div>
                      <div className="justify-end">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8"
                          onClick={() => remove(index)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={`Form ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => append({ name: "", type: "Payment", amount: 0 })}
            >
              Add Item
            </Button>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
