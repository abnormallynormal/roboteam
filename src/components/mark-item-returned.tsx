import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function MarkItemReturned({
  maxQ,
  value,
  name,
  handleSubmit,
}: {
  maxQ: number;
  value: string;
  name: string;
  handleSubmit: () => void;
}) {
  const formSchema = z
    .object({
      selection: z.string().min(1, {
        message: "Please select a return option.",
      }),
      partialReturned: z
        .number({ invalid_type_error: "Quantity is required" })
        .optional(),
    })
    .superRefine((data, ctx) => {
      const { selection, partialReturned } = data;
      if (selection === "partial") {
        if (partialReturned === undefined || partialReturned === null) {
          ctx.addIssue({
            code: "custom",
            message: "Quantity is required when partially returning items.",
            path: ["partialReturned"],
          });
          return;
        }

        if (partialReturned <= 0) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a positive value.",
            path: ["partialReturned"],
          });
          return;
        }

        if (partialReturned > maxQ) {
          ctx.addIssue({
            code: "custom",
            message: `Quantity cannot exceed ${maxQ}.`,
            path: ["partialReturned"],
          });
        }
      }
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selection: "full",
      partialReturned: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      await fetch(`/api/signout`, {
        method: "PATCH",
        body: JSON.stringify({
          email: name,
          item: value,
          originalQuantity: maxQ,
          returnQuantity: values.selection === "full" ? maxQ : values.partialReturned,
        }),
      });
    } catch (error) {
      console.error("Error updating form response:", error);
    }
    handleSubmit();
    form.reset();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="selection"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  defaultValue="full"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full">Fully returned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="partial" />
                    <Label htmlFor="partial">Partially returned</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("selection") === "partial" && (
          <FormField
            control={form.control}
            name="partialReturned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partially returned quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter quantity being returned"
                    value={
                      field.value === undefined || Number.isNaN(field.value)
                        ? ""
                        : field.value
                    }
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
        )}
        <div className="grid grid-cols-2 gap-4">
          <Button type="submit">Submit</Button>
          <Button
            variant="secondary"
            onClick={() => {
              form.reset();
              handleSubmit();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
