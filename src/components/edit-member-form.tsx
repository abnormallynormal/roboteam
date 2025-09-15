import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { ObjectId } from "mongodb";
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
    message: "Name must be at least 1 character.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  team: z.string().min(1, {
    message: "Please enter a team.",
  }),
});

interface EditMemberFormProps {
  id: string | undefined;
  name: string | undefined;
  team: string | undefined;
  onItemAdded?: () => void;
}

export default function EditMemberForm({
  id,
  name,
  team,
  onItemAdded,
}: EditMemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      team: team || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/member-list`, {
        method: "PATCH",
        body: JSON.stringify({
          id: id,
          name: values.name,
          team: values.team,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      onItemAdded?.();
    } catch (err) {
      console.error("Error updating member:", err);
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
              <FormLabel className="text-sm">Member Name</FormLabel>
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
              <FormLabel className="text-sm">Team</FormLabel>
              <FormControl>
                <Input placeholder="Team designation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4">
          Update Member
        </Button>
      </form>
    </Form>
  );
}
