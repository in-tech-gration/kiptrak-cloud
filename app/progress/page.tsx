import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import ProgressGrid from "./ProgressGrid";

export default async function ProgressPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  // TODO: Make this dynamic with a useCourseQuery hook
  const course = {
    id: "wdx-180",
    length: 36,
    description: "Web Development X - 180. Powered by intechgration",
    technologies: ["HTML", "CSS", "JavaScript"],
    created_at: "2024-06-07T13:30:35.524847+00:00",
    name: "WDX-180",
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <ProgressGrid course={course} />
    </div>
  );
}
