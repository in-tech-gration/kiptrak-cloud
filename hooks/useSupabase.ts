import { useMemo } from "react";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

export const useSupabase = () => {
  return useMemo(getSupabaseBrowserClient, []);
};
