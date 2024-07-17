import { supabase } from "@/utils/supabase/server";
import AccountForm from "./account-form";
import { redirect } from "next/navigation";
import EnrolledCourses from "./EnrolledCourses";

export default async function Account() {

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col w-1/2 gap-6">
      <EnrolledCourses user={user} />
      <div className="border-t border-t-foreground/10">
        <h2 className="text-center font-bold text-3xl p-2">Account Details</h2>
        <AccountForm user={user} />
      </div>
    </div>
  );
}
