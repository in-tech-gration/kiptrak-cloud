export const parseProgressParams = (slug: string[]) => {
  let course, day, week;

  if (slug.length === 2) {
    course = slug[0];
    week = Number(slug[1]);
  } else if (slug.length === 3) {
    course = slug[0];
    week = Number(slug[1]);
    day = Number(slug[2]);
  }

  return { course, day, week };
};
