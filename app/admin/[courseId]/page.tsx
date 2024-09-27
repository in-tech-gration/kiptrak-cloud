import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard";

// Generate Static URL parameters for static page generation
export function generateStaticParams() {
  const courses = [{ id: "wdx-180", weeks: 36 }];

  const staticParams = courses.map((course) => ({ courseId: course.id }));

  return staticParams;
}

function SuspenseFallback() {
  return <>placeholder</>;
}

export default function AdminCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AdminDashboard courseId={params.courseId} />
    </Suspense>
  );
}
