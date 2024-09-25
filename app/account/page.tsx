import AccountForm from "./AccountForm";
import EnrolledCourses from "./EnrolledCourses";

export default function Account() {
  return (
    <div className="flex-1 flex flex-col w-1/2 gap-6 justify-center">
      <AccountForm />
      <div className="border-t border-t-foreground/10">
        <EnrolledCourses />
      </div>
    </div>
  );
}
