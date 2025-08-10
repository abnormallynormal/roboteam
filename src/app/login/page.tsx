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
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
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
    router.push("/");
  }
  return (
    <div className="flex flex-col items-center my-24 min-h-screen">
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
              <div className="mx-8">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => signIn("google", {callbackUrl: "/"})}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
