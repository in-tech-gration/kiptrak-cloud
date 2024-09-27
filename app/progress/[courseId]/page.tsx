import { Suspense } from "react";
import ProgressDashboard from "./ProgressDashboard";

// Generate Static URL parameters for static page generation
export function generateStaticParams() {
  const courses = [{ id: "wdx-180", weeks: 36 }];

  const staticParams = courses.map((course) => ({ courseId: course.id }));

  return staticParams;
}

function SuspenseFallback() {
  return <>Loading...</>;
}

export default function ProgressByWeekAndDay({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ProgressDashboard courseId={params.courseId} />
    </Suspense>
  );
}
