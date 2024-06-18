import { PostgrestError } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "./supabase/client";
import {
  Progress,
  ProgressDraft,
  Course,
  RelProfileCourse,
  ReturnTypeHandleEnrollCourse,
} from "./supabase/types";

export const getProgressDraft = async (
  client: TypedSupabaseClient,
  week?: number,
  day?: number
) => {
  if (week && day) {
    const { data: progress } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)
      .eq("day", day)
      .throwOnError()) as { data: ProgressDraft[] };

    return progress;
  } else if (week) {
    const { data: progress } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)
      .throwOnError()) as { data: ProgressDraft[] };

    return progress;
  } else {
    return []; // return empty array if no week and day numbers were given
  }
};

export const getProgress = async (
  client: TypedSupabaseClient,
  userId: string,
  week?: number,
  day?: number
) => {
  if (week && day) {
    const { data: progress } = (await client
      .from("progress")
      .select()
      .eq("user_id", userId)
      .eq("week", week)
      .eq("day", day)
      .throwOnError()) as { data: Progress[] };

    return progress;
  } else if (week) {
    const { data: progress } = (await client
      .from("progress")
      .select()
      .eq("user_id", userId)
      .eq("week", week)
      .throwOnError()) as { data: Progress[] };

    return progress;
  } else {
    return []; // return empty array if no week and day numbers were given
  }
};

export const getCourses = async (client: TypedSupabaseClient) => {
  const { data: courses } = (await client
    .from("courses")
    .select()
    .throwOnError()) as { data: Course[] };

  return courses;
};

export const getEnrolledCourses = async (
  client: TypedSupabaseClient,
  userId: string
) => {
  const { data } = await client
    .from("rel_profiles_courses")
    .select("courses (id, name)")
    .eq("user_id", userId)
    .throwOnError();

  const enrolledCourses = data?.map(
    (value) => value.courses
  ) as Partial<Course>[];

  return enrolledCourses;
};

export const addEnrolledCourse = async (
  client: TypedSupabaseClient,
  userId: string,
  courseId: string
) => {
  const { data: enrolledCourses } = (await client
    .from("rel_profiles_courses")
    .insert([
      {
        user_id: userId,
        course_id: courseId,
      },
    ])
    .select()) as { data: RelProfileCourse[] };

  const { data, error } = (await client.rpc("handle_enroll_course", {
    course_name: courseId,
    val_for_user_id: userId,
  })) as { data: ReturnTypeHandleEnrollCourse; error: PostgrestError | null };

  // TODO: Check how to get the return value from the mutation hook to properly display the message to the UI
  if (error !== null) {
    console.log(error);
  } else {
    console.log(data);
  }
  return enrolledCourses;
};
