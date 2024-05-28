export const parseProgressParams = (slug: string[]) => {
  let day, week;

  if (slug.length === 1) {
    week = Number(slug[0]);
  } else if (slug.length === 2) {
    week = Number(slug[0]);
    day = Number(slug[1]);
  }

  return { day, week };
};
