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
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()
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
  const formSignin = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const formSignup = useForm<z.infer<typeof formSchema>>({
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
    console.log(values);
    router.push("/")
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <div className="mb-12">
          <Button variant="ghost">
            <ChevronLeftIcon />
            Back to Home
          </Button>
        </div>
        <div className="justify-self-center mt-2 text-3xl font-bold">
          RoboTeam
        </div>
        <div className="justify-self-center mb-2 p-4">
          Welcome to the future of robotics management
        </div>
        <div>
          <Card className="px-2 py-6 w-120 justify-self-center">
            <div>
              <div className="justify-self-center font-semibold text-2xl p-0 mb-1">
                Join Your Team
              </div>
              <div className="justify-self-center text-[14px] mb-4">
                Access your robotics team dashboard
              </div>
              <Tabs
                defaultValue="signin"
                className="w-100 flex justify-self-center"
              >
                <TabsList className="mb-2 flex justify-self-center w-full">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="m-0">
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
                              <Input
                                placeholder="team@robotics.com"
                                {...field}
                              />
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
                              <Input placeholder="••••••••" type="password" required {...field} />
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
                <TabsContent value="signup">
                  <Form {...formSignup}>
                    <form
                      onSubmit={formSignup.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="m-0 grid grid-cols-2 gap-4">
                        <FormField
                          control={formSignup.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="my-2">
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formSignup.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="my-2">
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Smith"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={formSignup.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="my-4">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="team@robotics.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSignup.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="my-6">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" type="password" {...field} />
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}