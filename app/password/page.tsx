"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { RotatingLines } from "react-loader-spinner";
import { SubmitButton } from "../login/submit-button";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Password() {
  const { session, isLoading: sessionLoading, error } = useSessionContext();
  const supabase = useSupabase();

  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }

  if ((!sessionLoading && !session?.user) || error) {
    redirect("/login");
  }

  async function updatePassword(formData: FormData) {
    const newPassword = formData.get("password") as string;

    // https://supabase.com/docs/reference/javascript/auth-updateuser
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (data) {
      toast.success("Password updated successfully!");
    }

    if (error) {
      toast.error("Ops! Something went wrong.");
      console.log({ error });
    }

    redirect("/account");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          disabled={true}
          // @ts-ignore
          value={session?.user.identities[0].email}
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
          placeholder=""
          required
        />
        <SubmitButton
          formAction={updatePassword}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Updating password..."
        >
          Update Password
        </SubmitButton>
      </form>
    </div>
  );
}
