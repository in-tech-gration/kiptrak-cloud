import { TypedSupabaseClient } from "./supabase/client";
import { Progress, ProgressDraft } from "./supabase/types";

export const getProgressDraft = async (
  client: TypedSupabaseClient,
  week: number,
  day?: number
) => {
  if (day) {
    const { data: progress } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)
      .eq("day", day)
      .throwOnError()) as { data: ProgressDraft[] };

    return progress;
  } else {
    const { data: progress } = (await client
      .from("progress_draft")
      .select()
      .eq("week", week)
      .throwOnError()) as { data: ProgressDraft[] };

    return progress;
  }
};

export const getProgress = async (
  client: TypedSupabaseClient,
  week: number,
  day?: number
) => {
  if (day) {
    const { data: progress } = (await client
      .from("progress")
      .select()
      .eq("week", week)
      .eq("day", day)
      .throwOnError()) as { data: Progress[] };

    return progress;
  } else {
    const { data: progress } = (await client
      .from("progress")
      .select()
      .eq("week", week)
      .throwOnError()) as { data: Progress[] };

    return progress;
  }
};
