import { getEnrolledCourses } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

export const useEnrolledCoursesQuery = (userId: string) => {
  const client = useSupabase();
  const queryKey = ["enrolledCourses", { user_id: userId }];

  const queryFn = async () => {
    return getEnrolledCourses(client, userId);
  };
  return useQuery({ queryKey, queryFn });
};
