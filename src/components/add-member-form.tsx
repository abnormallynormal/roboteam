import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a name.",
  }),
  team: z.string().min(1, {
    message: "Please enter a team.",
  }),
});

interface AddMemberFormProps {
  onItemAdded?: () => void;
}

export default function AddMemberForm({
  onItemAdded,
}: AddMemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      team: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/member-list`, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          team: values.team,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter member name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <Input placeholder="Team designation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Member
        </Button>
      </form>
    </Form>
  );
}
