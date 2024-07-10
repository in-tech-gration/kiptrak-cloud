export const parseProgressParams = (slug: string[]) => {
  let courseId, day, week;

  if (slug.length === 2) {
    courseId = slug[0];
    week = Number(slug[1]);
  } else if (slug.length === 3) {
    courseId = slug[0];
    week = Number(slug[1]);
    day = Number(slug[2]);
  }

  return { courseId, day, week };
};
