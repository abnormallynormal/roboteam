"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function SignOutForm() {
  const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    firstName: z.string().min(1, {
      message: "First name is required.",
    }),
    lastName: z.string().min(1, {
      message: "First name is required.",
    }),
  });
  const formSignout = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const formSignin = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        {/* <div className="mb-4">
          <Button variant="ghost">
            <ChevronLeftIcon />
            Back to Home
          </Button>
        </div> */}
        <div className="justify-self-center my-8 text-3xl font-bold">
          STL Robotics Sign Out Form
        </div>

        <div>
          <Card className="w-fit justify-self-center py-4 px-8">
            <Tabs
              defaultValue="signout"
              className="w-100 flex justify-self-center"
            >
              <TabsList className="mb-2 flex justify-self-center w-full">
                <TabsTrigger value="signout">Sign Out Item</TabsTrigger>
                <TabsTrigger value="signin">Sign In Item</TabsTrigger>
              </TabsList>
              <TabsContent value="signout" className="m-0">
                <Form {...formSignin}>
                  <form
                    onSubmit={formSignin.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={formSignin.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="team@robotics.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formSignin.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="my-6">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signin">
                <Form {...formSignout}>
                  <form
                    onSubmit={formSignin.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="m-0 grid grid-cols-2 gap-4">
                      <FormField
                        control={formSignin.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="my-2">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSignin.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="my-2">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={formSignin.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="my-4">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="team@robotics.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formSignin.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="my-6">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
