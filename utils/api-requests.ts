import { toast } from "react-hot-toast";
import { PostgrestError } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "./supabase/client";
import {
  Progress,
  ProgressDraft,
  Course,
  RelProfileCourse,
  ReturnTypeHandleEnrollCourse,
  Profile,
} from "./supabase/types";
import { WeeklyProgress } from "@/lib/types";

export const getProgressDraft = async (
  client: TypedSupabaseClient,
  week?: number,
  day?: number
) => {
  if (week && day) {
    const { data: progress, error } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)
      .eq("day", day)) as {
      data: ProgressDraft[];
      error: PostgrestError | null;
    };

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return progress;
  } else if (week) {
    const { data: progress, error } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)) as {
      data: ProgressDraft[];
      error: PostgrestError | null;
    };

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return progress;
  } else {
    return []; // return empty array if no week and day numbers were given
  }
};

export const getProgress = async (
  client: TypedSupabaseClient,
  userId: string,
  courseId: string,
  week?: number,
  day?: number
) => {
  if (week && day) {
    const { data: progress, error } = (await client
      .from("progress")
      .select()
      .eq("user_id", userId)
      .eq("course", courseId)
      .eq("week", week)
      .eq("day", day)) as { data: Progress[]; error: PostgrestError | null };

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return progress;
  } else if (week) {
    const { data: progress, error } = (await client
      .from("progress")
      .select()
      .eq("user_id", userId)
      .eq("course", courseId)
      .eq("week", week)
      .order("day")) as { data: Progress[]; error: PostgrestError | null };

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return progress;
  } else {
    return []; // return empty array if no week and day numbers were given
  }
};

export const updateProgress = async (
  client: TypedSupabaseClient,
  updateData: Progress[]
) => {
  const { data: progress, error } = (await client
    .from("progress")
    .upsert(updateData)
    .select()) as { data: Progress[]; error: PostgrestError | null };

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return progress;
};

export const getCourse = async (
  client: TypedSupabaseClient,
  courseId: string
) => {
  const { data: course, error } = (await client
    .from("courses")
    .select()
    .eq("id", courseId)
    .single()) as { data: Course; error: PostgrestError | null };

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return course;
};

export const getCourses = async (client: TypedSupabaseClient) => {
  const { data: courses, error } = (await client.from("courses").select()) as {
    data: Course[];
    error: PostgrestError | null;
  };

  if (error) {
    toast.error(error.message);
    throw error;
  }

  return courses;
};

export const getEnrolledCourses = async (
  client: TypedSupabaseClient,
  userId: string
) => {
  const { data, error } = await client
    .from("rel_profiles_courses")
    .select("courses (id, name)")
    .eq("user_id", userId);

  if (error) {
    toast.error(error.message);
    throw error;
  }

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
  })) as {
    data: ReturnTypeHandleEnrollCourse;
    error: PostgrestError | null;
  };

  if (error) {
    toast.error(error.message);
    throw error;
  }
  console.log(data);
  return enrolledCourses;
};

export const getEnrolledUsers = async (
  client: TypedSupabaseClient,
  courseId: string
) => {
  const { data, error } = await client
    .from("rel_profiles_courses")
    .select("profiles (id, full_name)")
    .eq("course_id", courseId);

  if (error) {
    toast.error(error.message);
    throw error;
  }

  const enrolledUsers = data?.map((d) => d.profiles) as Partial<Profile>[];

  return enrolledUsers;
};

export const getUserWeeklyProgress = async (
  client: TypedSupabaseClient,
  userId: string
) => {
  const { data, error } = await client
    .from("progress")
    .select("week, day, completed")
    .eq("user_id", userId)
    .order("week, day");

  if (error) {
    toast.error(error.message);
    throw error;
  }

  // Assigned acc to any to avoid stupid TS errors.
  const result = data.reduce((acc: any, row) => {
    const key = `${row.week}-${row.day}`;
    if (!acc[key]) {
      acc[key] = {
        week: row.week,
        day: row.day,
        completedTasks: 0,
        totalTasks: 0,
      };
    }
    acc[key].totalTasks += 1;
    if (row.completed) {
      acc[key].completedTasks += 1;
    }
    return acc;
  }, {});

  const weeklyProgress = Object.values(result) as WeeklyProgress[];

  return weeklyProgress;
};
