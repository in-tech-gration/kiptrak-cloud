"use client";
import Avatar from "./Avatar";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { useCallback, useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AccountForm() {
  const { session, isLoading: sessionLoading } = useSessionContext();

  if (sessionLoading) {
    return <></>;
  }

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  const supabase = useSupabase();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", session?.user.id as string)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      toast.error("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [session?.user, supabase]);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session?.user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: session?.user.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-center font-bold text-3xl p-2">Account Details</h2>
      <div className="p-3 text-center flex justify-evenly">
        <div className="flex flex-col justify-center gap-1">
          <label htmlFor="email">Email</label>
          <input
            className="text-black mx-4 text-center"
            id="email"
            type="text"
            value={session?.user.email}
            disabled
          />
          <label htmlFor="fullName">Full Name</label>
          <input
            className="text-black mx-4 text-center"
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
          />
          <label htmlFor="username">Username</label>
          <input
            className="text-black mx-4 text-center"
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="website">Website</label>
          <input
            className="text-black mx-4 text-center"
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Avatar
            uid={session?.user.id ?? null}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ fullname, username, website, avatar_url: url });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        <button
          className="p-2 rounded font-bold bg-green-500 hover:bg-green-700"
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </>
  );
}
