import ProgressDashboard from "./ProgressDashboard";

// Generate Static URL parameters for static page generation
export function generateStaticParams() {
  const courses = [{ id: "wdx-180", weeks: 36 }];

  const staticParams = courses
    .map((course) =>
      [{ slug: [course.id] }]
        .concat(
          [...Array(course.weeks)]
            .map((_, week) =>
              [...Array(5)]
                .map((_, day) => [
                  { slug: [course.id, `${week + 1}`, `${day + 1}`] },
                ])
                .flat()
            )
            .flat()
        )
        .flat()
    )
    .flat();
  return staticParams;
}

export default function ProgressByWeekAndDay() {
  return <ProgressDashboard />;
}
