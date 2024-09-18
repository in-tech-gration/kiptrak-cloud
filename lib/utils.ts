import { WeeklyProgress } from "./types";

export const colorsForTaskCompletion = (
  weeklyProgresses: WeeklyProgress[],
  courseLength: number,
  days: number
) => {
  let colors: string[][] = Array.from(Array(courseLength), () =>
    Array(days).fill("bg-gray-400")
  );

  weeklyProgresses.forEach((weeklyProgress, index) => {
    if (
      weeklyProgress.completedTasks > 0 &&
      weeklyProgress.completedTasks < weeklyProgress.totalTasks
    ) {
      colors[weeklyProgress.week - 1][weeklyProgress.day - 1] = "bg-yellow-400";
    } else if (weeklyProgress.completedTasks === weeklyProgress.totalTasks) {
      colors[weeklyProgress.week - 1][weeklyProgress.day - 1] = "bg-green-500";
    }
  });
  return colors;
};
