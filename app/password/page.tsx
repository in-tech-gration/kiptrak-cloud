"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useSupabase } from "@/hooks/useSupabase";
import { SubmitButton } from "../login/submit-button";

export default function EnrolledCourses() {

  const { session, isLoading: sessionLoading, error } = useSessionContext();
  const supabase = useSupabase();

  console.log({ session, error });

  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }

  if (!sessionLoading && !session?.user || error ) {
    redirect("/login");
  }

  async function updatePassword(formData:FormData){
    const newPassword = formData.get("password") as string;
    toast.error("Could not authenticate user.");

    // https://supabase.com/docs/reference/javascript/auth-updateuser
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if ( data ){
      return toast.success("Password updated successfully!");
    }
    toast.error("Ops! Something went wrong.");
    console.log({ error });
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
  )

}
