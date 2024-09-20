

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "test";


ALTER SCHEMA "test" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_permission" AS ENUM (
    'progress.select',
    'progress_draft.update',
    'progress.update',
    'rel_profile_courses.select'
);


ALTER TYPE "public"."app_permission" OWNER TO "postgres";


CREATE TYPE "public"."app_role" AS ENUM (
    'admin'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."level" AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
);


ALTER TYPE "public"."level" OWNER TO "postgres";


COMMENT ON TYPE "public"."level" IS 'Level of skill required on a progress task';



CREATE OR REPLACE FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;
$$;


ALTER FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Fetch the user role in the user_roles table
    select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_enroll_course"("course_name" "text", "val_for_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  INSERT INTO progress (completed, concept, confidence, course, day, instructions, level, task, week, user_id, draft_id)
  SELECT completed, concept, confidence, course, day, instructions, level, task, week, val_for_user_id, id
  FROM progress_draft
  WHERE course = course_name;

  RETURN 'Sucessfully inserted progress for course: ' || course_name;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error inserting progress: ' || SQLERRM;
END;$$;


ALTER FUNCTION "public"."handle_enroll_course"("course_name" "text", "val_for_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_for_each_course"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  course_row courses%rowtype;
begin
  select * into course_row from courses where new.course = courses.id;
  perform insert_progress_from_draft(course_row.id, new);
  return new;
end;
$$;


ALTER FUNCTION "public"."insert_for_each_course"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."progress_draft" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "week" smallint DEFAULT '0'::smallint NOT NULL,
    "day" smallint DEFAULT '0'::smallint NOT NULL,
    "concept" "text" DEFAULT ''::"text" NOT NULL,
    "task" "text" DEFAULT ''::"text" NOT NULL,
    "level" "public"."level" DEFAULT 'Beginner'::"public"."level" NOT NULL,
    "confidence" smallint DEFAULT '0'::smallint NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    "instructions" "text" DEFAULT ''::"text" NOT NULL,
    "course" "text"
);


ALTER TABLE "public"."progress_draft" OWNER TO "postgres";


COMMENT ON TABLE "public"."progress_draft" IS 'Progress Draft rows for a week+day';



CREATE OR REPLACE FUNCTION "public"."insert_progress_from_draft"("c_id" "text", "new" "public"."progress_draft") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  enrolled_id uuid; -- declare a variable to store a result for each row
begin
  -- loop over the ids of  all enrolled users
  for enrolled_id in
    select user_id
    from rel_profiles_courses
    where course_id = c_id
  loop
    -- insert into progress table for each enrolled user
    raise info '% | insert new progress from course % for user %', now(), c_id, enrolled_id;
    insert into progress (week, day, concept, task, level, confidence, completed, instructions, course, user_id, draft_id)
    values (new.week, new.day, new.concept, new.task, new.level, new.confidence, new.completed, new.instructions, c_id, enrolled_id, new.id);
  end loop;
  -- return new;
end;
$$;


ALTER FUNCTION "public"."insert_progress_from_draft"("c_id" "text", "new" "public"."progress_draft") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_progress_by_draft"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  update progress
  set
    concept = new.concept,
    task = new.task,
    level = new.level,
    confidence = new.confidence,
    completed = new.completed,
    instructions = new.instructions
  where progress.draft_id = new.id;
  return new;
end;$$;


ALTER FUNCTION "public"."update_progress_by_draft"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "text" NOT NULL,
    "length" smallint NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "technologies" "text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


COMMENT ON TABLE "public"."courses" IS 'All courses of intechgration';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Profile for each user';



CREATE TABLE IF NOT EXISTS "public"."progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "week" smallint DEFAULT '0'::smallint NOT NULL,
    "day" smallint DEFAULT '0'::smallint NOT NULL,
    "concept" "text" DEFAULT ''::"text" NOT NULL,
    "task" "text" DEFAULT ''::"text" NOT NULL,
    "level" "public"."level" DEFAULT 'Beginner'::"public"."level" NOT NULL,
    "confidence" smallint DEFAULT '0'::smallint NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    "instructions" "text" DEFAULT ''::"text" NOT NULL,
    "course" "text",
    "user_id" "uuid",
    "draft_id" "uuid"
);


ALTER TABLE "public"."progress" OWNER TO "postgres";


COMMENT ON TABLE "public"."progress" IS 'Progress for a week and day';



CREATE TABLE IF NOT EXISTS "public"."rel_profiles_courses" (
    "user_id" "uuid" NOT NULL,
    "course_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rel_profiles_courses" OWNER TO "postgres";


COMMENT ON TABLE "public"."rel_profiles_courses" IS '(enrolled courses)This table is used to define many to many relationship between the profiles and the courses tables';



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'Application permissions for each role.';



ALTER TABLE "public"."role_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."role_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_roles" IS 'Application roles for each user.';



ALTER TABLE "public"."user_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "course_name_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."progress_draft"
    ADD CONSTRAINT "progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progress"
    ADD CONSTRAINT "progress_pkey1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rel_profiles_courses"
    ADD CONSTRAINT "rel_profiles_courses_pkey" PRIMARY KEY ("user_id", "course_id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_permission_key" UNIQUE ("role", "permission");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



CREATE OR REPLACE TRIGGER "sync_progress_with_draft" AFTER UPDATE ON "public"."progress_draft" FOR EACH ROW EXECUTE FUNCTION "public"."update_progress_by_draft"();



CREATE OR REPLACE TRIGGER "sync_progress_with_draft_insert" AFTER INSERT ON "public"."progress_draft" FOR EACH ROW EXECUTE FUNCTION "public"."insert_for_each_course"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progress"
    ADD CONSTRAINT "progress_course_fkey" FOREIGN KEY ("course") REFERENCES "public"."courses"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progress_draft"
    ADD CONSTRAINT "progress_draft_course_fkey" FOREIGN KEY ("course") REFERENCES "public"."courses"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progress"
    ADD CONSTRAINT "progress_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "public"."progress_draft"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."progress"
    ADD CONSTRAINT "progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rel_profiles_courses"
    ADD CONSTRAINT "rel_profiles_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rel_profiles_courses"
    ADD CONSTRAINT "rel_profiles_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow auth admin to read user roles" ON "public"."user_roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow authorized admin select access" ON "public"."progress" FOR SELECT USING (( SELECT "public"."authorize"('progress.select'::"public"."app_permission") AS "authorize"));



CREATE POLICY "Allow authorized admin select access" ON "public"."rel_profiles_courses" FOR SELECT USING (( SELECT "public"."authorize"('rel_profile_courses.select'::"public"."app_permission") AS "authorize"));



CREATE POLICY "Allow authorized admin update access" ON "public"."progress" FOR UPDATE USING (( SELECT "public"."authorize"('progress.update'::"public"."app_permission") AS "authorize"));



CREATE POLICY "Allow authorized admin update access" ON "public"."progress_draft" FOR UPDATE USING (( SELECT "public"."authorize"('progress_draft.update'::"public"."app_permission") AS "authorize"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."rel_profiles_courses" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Select Course by All" ON "public"."courses" FOR SELECT USING (true);



CREATE POLICY "Select Progress Draft by Authenticated" ON "public"."progress_draft" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can do ALL actions by user_id" ON "public"."progress" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can read their own enrolled courses" ON "public"."rel_profiles_courses" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progress_draft" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rel_profiles_courses" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";
































































































































































































GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";



REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."handle_enroll_course"("course_name" "text", "val_for_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_enroll_course"("course_name" "text", "val_for_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_enroll_course"("course_name" "text", "val_for_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_for_each_course"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_for_each_course"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_for_each_course"() TO "service_role";



GRANT ALL ON TABLE "public"."progress_draft" TO "anon";
GRANT ALL ON TABLE "public"."progress_draft" TO "authenticated";
GRANT ALL ON TABLE "public"."progress_draft" TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_progress_from_draft"("c_id" "text", "new" "public"."progress_draft") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_progress_from_draft"("c_id" "text", "new" "public"."progress_draft") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_progress_from_draft"("c_id" "text", "new" "public"."progress_draft") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_progress_by_draft"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_progress_by_draft"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_progress_by_draft"() TO "service_role";





















GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."progress" TO "anon";
GRANT ALL ON TABLE "public"."progress" TO "authenticated";
GRANT ALL ON TABLE "public"."progress" TO "service_role";



GRANT ALL ON TABLE "public"."rel_profiles_courses" TO "anon";
GRANT ALL ON TABLE "public"."rel_profiles_courses" TO "authenticated";
GRANT ALL ON TABLE "public"."rel_profiles_courses" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "service_role";
GRANT ALL ON TABLE "public"."user_roles" TO "supabase_auth_admin";



GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
