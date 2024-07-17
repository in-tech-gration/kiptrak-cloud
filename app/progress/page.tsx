import { redirect } from "next/navigation";

import { supabase } from "@/utils/supabase/server";

import ProgressGrid from "./ProgressGrid";

export default async function ProgressPage() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-5 justify-center items-center">
      <ProgressGrid />
    </div>
  );
}
