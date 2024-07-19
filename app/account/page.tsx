import AccountForm from "./AccountForm";
import EnrolledCourses from "./EnrolledCourses";

export default function Account() {

  return (
    <div className="flex-1 flex flex-col w-1/2 gap-6">
      <EnrolledCourses />
      <div className="border-t border-t-foreground/10">
        <h2 className="text-center font-bold text-3xl p-2">Account Details</h2>
        <AccountForm />
      </div>
    </div>
  );
}
