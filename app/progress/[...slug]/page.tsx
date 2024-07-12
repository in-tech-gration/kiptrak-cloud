import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import ProgressDashboard from "./ProgressDashboard";

// Generate Static URL parameters for static page generation
export function generateStaticParams() {
  return [...Array(36)]
    .map((_, week) =>
      [...Array(5)]
        .map((_, day) => [{ slug: ["wdx-180", `${week + 1}`, `${day + 1}`] }])
        .flat()
    )
    .flat();
}

export default async function ProgressByWeekAndDay() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }
  return <ProgressDashboard user={data.user} />;
}
