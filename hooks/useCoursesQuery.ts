import { getCourses } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

export const useCoursesQuery = () => {
  const client = useSupabase();
  const queryKey = ["courses"];

  const queryFn = async () => {
    return getCourses(client);
  };
  return useQuery({ queryKey, queryFn });
};
