# KipTrak Cloud

The ideal tool to keep track of your progress!

Powered by [intechgration](https://intechgration.io/)

> This project was built using the '[Next.js and Supabase Starter Kit](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)' template

## Clone and run locally

1. Set up Supabase to run locally. You're going to require to install the following:

1. [Docker](https://www.docker.com/)
1. [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

After you have successfully installed the above execute the following commands:

1. Make sure that **Docker is running** and run `supabase start` in order to create an instance of a Supabase project locally.
2. Run `supabase login` to login to your Supabase Account
3. Run `supabase link --project-ref <PROJECT_REF>` to link your local Supabase instance to your remote Supabase instance.


    - The `<PROJECT_REF>` can be found in `Project Settings > General > Reference ID` in your Supabase Dashboard

4. Run `supabase db dump --data-only -f supabase/seed.sql` in order to populate your local database with the data of the remote Supabase instance. _The file `supabase/seed.sql` is in the gitignore list to avoid pushing sensitive data online._

Now you have a running copy of the remote Supabase instance!

2. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in:

- _for use of the local version_: the output of the command `supabase status`
- _for use of the remote version_: [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   KipTrak Cloud should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

---

_Based on: [https://github.com/supabase/supabase/tree/master/examples/auth/nextjs](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)_
