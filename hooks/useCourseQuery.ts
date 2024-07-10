import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/utils/api-requests";

export const useCourseQuery = (courseId: string) => {
  const client = useSupabase();
  const queryKey = ["course"];

  const queryFn = async () => {
    return getCourse(client, courseId);
  };
  return useQuery({ queryKey, queryFn });
};

