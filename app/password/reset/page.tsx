"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { SubmitButton } from "@/app/login/submit-button";

export default function PasswordReset() {
  const supabase = useSupabase();

  async function resetPassword(formData: FormData) {
    const email = formData.get("email") as string;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (data) {
      toast.success("Reset password email has been sent!");
    }

    if (error) {
      toast.error("Ops! Something went wrong.");
      console.log({ error });
    }

    return;
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <div className="mb-10">
          <h1 className="text-3xl text-center font-bold text-green-500">
            Forgot your password?
          </h1>
          <h3 className="text-sm text-center text-gray-400">
            Please enter the email you use to sign in to KipTrak Cloud
          </h3>
        </div>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <SubmitButton
          formAction={resetPassword}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Sending request..."
        >
          Request password reset
        </SubmitButton>
        <Link
          href="/login"
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
      </form>
    </div>
  );
}
