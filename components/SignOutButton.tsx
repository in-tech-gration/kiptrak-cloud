"use client";

import { redirect } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";

export const SignOutButton = () => {
  const supabase = useSupabase();

  const signOut = async () => {
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <form action={signOut}>
      <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </form>
  );
};
