"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useSupabase } from "@/hooks/useSupabase";
import { RotatingLines } from "react-loader-spinner";

export default function Login() {
  const supabase = useSupabase();
  const { session, isLoading: sessionLoading } = useSessionContext();
  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }
  if (!sessionLoading && session?.user) {
    redirect("/progress");
  }

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Could not authenticate user.");
      console.log(`Could not authenticate user: ${error.message}`);
      return redirect("/login");
    }

    return redirect("/");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <Link
          href="/"
          className="py-2 px-4 rounded-md text-foreground bg-btn-background hover:bg-btn-background-hover flex justify-center items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
        <Link
          href="/password/reset"
          className="flex justify-center text-blue-600 hover:underline"
        >
          Forgotten your password?
        </Link>
      </form>
    </div>
  );
}
