import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>;

let client: TypedSupabaseClient;

export const getSupabaseBrowserClient = () => {
  if (client) {
    return client;
  }

  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
};
