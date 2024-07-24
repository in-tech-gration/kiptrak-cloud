import { toast } from "react-hot-toast";
import { useSupabase } from "./useSupabase";
import { Progress } from "@/utils/supabase/types";
import { updateProgress } from "@/utils/api-requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProgressUpdate = () => {
  const client = useSupabase();
  const queryClient = useQueryClient();

  const mutationFn = async (updateData: Progress[]) => {
    return updateProgress(client, updateData);
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
