import CoursesGrid from "@/components/CoursesGrid";

export default function ProgressPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-5 justify-center items-center">
      <CoursesGrid baseUrl="/progress" />
    </div>
  );
}
