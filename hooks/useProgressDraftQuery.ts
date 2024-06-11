import { getProgressDraft } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

export const useProgressDraftQuery = (week?: number, day?: number) => {
  const client = useSupabase();
  const queryKey = ["progressDrafts", { week: week }, { day: day }];

  const queryFn = async () => {
    return getProgressDraft(client, week, day);
  };
  return useQuery({ queryKey, queryFn });
};
