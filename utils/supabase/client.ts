import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

export type TypedSupabaseClient = ReturnType<
  typeof createBrowserClient<Database>
>;

let client: TypedSupabaseClient;

export const getSupabaseBrowserClient = () => {
  if (client) {
    return client;
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
};
