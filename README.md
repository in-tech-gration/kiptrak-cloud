# KipTrak Cloud

The ideal tool to keep track of your progress!

Powered by [intechgration](https://intechgration.io/)

> This proeject was built using the '[Next.js and Supabase Starter Kit](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)' template

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a table named `progress_draft` consisting of 10 columns:

   ```md
   - id: uuid
   - created_at: timestamp
   - week: int2
   - day: int2
   - concept: text
   - task: text
   - level: USER-DEFINED enum ('Beginner', 'Intermediate', 'Advanced')
   - confidence: int2
   - completed: bool
   - instructions: text
   ```

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   KipTrak Cloud should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

---

_Based on: [https://github.com/supabase/supabase/tree/master/examples/auth/nextjs](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)_