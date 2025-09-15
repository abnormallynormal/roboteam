import {
  Form,
  FormControl,
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
import { Member } from "@/app/members/columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
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
  .superRefine((data, ctx) => {
    if (
      data.type === "Payment" &&
      (data.amount === undefined || data.amount === null || isNaN(data.amount))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount is required when form is of type payment.",
        path: ["amount"],
      });
    }
    if (data.type === "Payment" && data.amount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount must be greater than 0.",
        path: ["amount"],
      });
    }
  });

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
  .superRefine((data, ctx) => {
    if (
      data.type === "Payment" &&
      (data.amount === undefined || data.amount === null || isNaN(data.amount))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount is required when payment is selected.",
        path: ["amount"],
      });
    }
  });

export default function AddForm({
  handleSubmit,
}: {
  handleSubmit: () => void;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
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
  const fetchData = async () => {
    const result = await fetch(`/api/member-list`);
    const data = await result.json();
    const temp: Member[] = [];
    data.forEach((member: any) => {
      temp.push({
        _id: member._id,
        name: member.name,
        team: member.team,
      });
    });
    return temp; // Return the data instead of setting state
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const membersData = await fetchData(); // Get the data directly
    console.log(membersData); // This will show the actual data
    try {
      const response = await fetch(`/api/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          type: values.type,
          amount: values.amount,
          suppForms: values.suppForms,
          teamMembers: membersData // Use the fetched data directly
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      handleSubmit();
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
                  <FormLabel>Type of form</FormLabel>
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
                        placeholder="Enter dollar amount for payment"
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
            </div>
          )}
          {extraFields.map((fieldItem, index) => {
            return (
              <div key={fieldItem.id} className="space-y-4 relative">
                <div className="grid grid-cols-2 gap-4 ">
                  <FormField
                    control={form.control}
                    name={`suppForms.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name of supplemental form {index + 1}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="School Permission Form"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormField
                      control={form.control}
                      name={`suppForms.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="grid grid-cols-[1fr_auto]">
                            <div>Type of form</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="justify-self-end h-4 text-red-500 hover:text-red-700 hover:bg-background"
                              onClick={() => remove(index)}
                            >
                              <Trash />
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder="Select type"
                                  {...field}
                                />
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
                </div>
                {form.watch(`suppForms.${index}.type`) === "Payment" && (
                  <div>
                    <FormField
                      control={form.control}
                      name={`suppForms.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment amount</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter dollar amount for payment"
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
                  </div>
                )}
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => append({ name: "", type: "", amount: undefined })}
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
