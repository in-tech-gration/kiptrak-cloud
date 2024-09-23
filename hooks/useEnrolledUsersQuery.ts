import { getEnrolledUsers } from "@/utils/api-requests";
import { useSupabase } from "./useSupabase";
import { useQuery } from "@tanstack/react-query";

export const useEnrolledUsersQuery = (courseId: string) => {
  const client = useSupabase();
  const queryKey = ["enrolledUsers", { course_id: courseId }];

  const queryFn = async () => {
    return getEnrolledUsers(client, courseId);
  };
  return useQuery({ queryKey, queryFn });
};
