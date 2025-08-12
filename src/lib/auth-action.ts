"use server";
import { signIn } from "../../auth";
import { signOut } from "../../auth";
export async function SignIn() {
  return await signIn("google", { redirectTo: "/" });
}

export async function SignOut() {
  return await signOut();
}
