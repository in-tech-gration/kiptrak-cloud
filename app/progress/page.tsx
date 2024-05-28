import ProgressGrid from "./ProgressGrid";

export default function ProgressPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      {/* TODO: Add a course entity to database in order to make this dynamic */}
      <ProgressGrid courseTitle="WDX-180" numOfWeeks={36} />
    </div>
  );
}
