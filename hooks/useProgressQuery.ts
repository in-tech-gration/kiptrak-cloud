import { getProgress } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

// TODO: Update progressQuery to fetch progress by courseId also
export const useProgressQuery = (
  userId: string,
  courseId: string,
  week?: number,
  day?: number
) => {
  const client = useSupabase();
  const queryKey = [
    "progress",
    { user: userId },
    { course: courseId },
    { week: week },
    { day: day },
  ];

  const queryFn = async () => {
    return getProgress(client, userId, courseId, week, day);
  };
  return useQuery({ queryKey, queryFn });
};
