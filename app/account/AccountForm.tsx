"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AccountForm() {
  const [isGitHubUser, setIsGitHubUser] = useState(false);
  const { session, isLoading: sessionLoading } = useSessionContext();

  useEffect(() => {
    if (session?.user.app_metadata.provider === "github") {
      setIsGitHubUser(true);
    }
  }, [session?.user]);

  if (sessionLoading) {
    return <></>;
  }

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  if (isGitHubUser) {
    return (
      <>
        <h2 className="text-center font-bold text-3xl p-2">Account Details</h2>
        <div className="p-3 text-center flex justify-evenly">
          <div className="flex flex-col justify-center gap-1 w-10/12">
            <div className="flex flex-row justify-around text-green-500 font-bold text-2xl">
              {session.user.user_metadata.full_name}
              <img
                src={session.user.user_metadata.avatar_url}
                className="w-10 h-10 rounded-full"
                alt="github avatar"
              />
            </div>
            <div className="text-xl text-gray-400">{session.user.email}</div>
            <a
              className="text-xl font-bold text-gray-400 hover:text-green-400"
              href={`https://github.com/${session.user.user_metadata.user_name}`}
              target="_blank"
            >
              GitHub Profile
            </a>
          </div>
        </div>
      </>
    );
  }

  // User singed in via E-mail
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
        </div>
      </div>
    </>
  );
}
