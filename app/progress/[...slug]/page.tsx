import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import ProgressDashboard from "./ProgressDashboard";

export default async function ProgressByWeekAndDay() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }
  return <ProgressDashboard user={data.user} />;
}
