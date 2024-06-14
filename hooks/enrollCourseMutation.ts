import { useSupabase } from "./useSupabase";
import { addEnrolledCourse } from "@/utils/api-requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const enrollCourseMutation = () => {
  const client = useSupabase();
  const queryClient = useQueryClient();

  const mutationFn = async ({
    userId,
    courseName,
  }: {
    userId: string;
    courseName: string;
  }) => {
    return addEnrolledCourse(client, userId, courseName);
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enrolledCourses"],
      });
    },
  });
};
