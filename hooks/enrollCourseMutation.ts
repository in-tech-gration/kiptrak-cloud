import { useSupabase } from "./useSupabase";
import { addEnrolledCourse } from "@/utils/api-requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const enrollCourseMutation = () => {
  const client = useSupabase();
  const queryClient = useQueryClient();

  const mutationFn = async ({
    userId,
    courseId,
  }: {
    userId: string;
    courseId: string;
  }) => {
    return addEnrolledCourse(client, userId, courseId);
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
