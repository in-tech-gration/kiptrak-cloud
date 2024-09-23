import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";
import { getUserWeeklyProgress } from "@/utils/api-requests";

export const useWeeklyProgressQuery = (userId: string) => {
  const client = useSupabase();
  const queryKey = ["weeklyProgress", { user: userId }];

  const queryFn = async () => {
    return getUserWeeklyProgress(client, userId);
  };
  return useQuery({ queryKey, queryFn });
};
