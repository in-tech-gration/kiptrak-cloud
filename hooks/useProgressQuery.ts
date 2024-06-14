import { getProgress } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

export const useProgressQuery = (
  userId: string,
  week?: number,
  day?: number
) => {
  const client = useSupabase();
  const queryKey = ["progress", { user: userId }, { week: week }, { day: day }];

  const queryFn = async () => {
    return getProgress(client, userId, week, day);
  };
  return useQuery({ queryKey, queryFn });
};
