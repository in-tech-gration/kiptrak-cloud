"use client";

import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEnrolledUsersQuery } from "@/hooks/useEnrolledUsersQuery";
import { Profile } from "@/utils/supabase/types";
import { ProgressSpreadsheet } from "@/components/ProgressSpreadsheet";

export default function Admin() {
  const [user, setUser] = useState<Partial<Profile>>();
  const [week, setWeek] = useState<number>();
  const {
    data: enrolledUsers,
    isLoading,
    isError,
    error,
  } = useEnrolledUsersQuery("wdx-180");
  const { session, isLoading: sessionLoading } = useSessionContext();

  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  const jwt = jwtDecode(session?.access_token as string);

  // @ts-ignore
  const userRole = jwt.user_role;

  // Role-Based Access Control (RBAC) was implemented via Supabase Custom claims following the guide below:
  // https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
  if (userRole !== "admin") {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">
          You need admin privileges in order to view this page.
        </h1>
        <h2 className="text-2xl text-gray-400">
          Please contact us for more info
        </h2>
      </div>
    );
  }

  let content;

  if (isLoading) {
    content = <RotatingLines width="50" />;
  } else if (isError) {
    content = (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">
          Supabase Error: ${error?.message}
        </h1>
      </div>
    );
  } else {
    content = (
      <>
        <h2 className="text-center font-bold text-3xl p-2 text-gray-400">
          Enrolled Users
        </h2>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center">
          {enrolledUsers?.map((u, index) => (
            <button
              key={`course-button-${index}`}
              className={`grid gap-2 bg-white border-4 text-green-500 rounded p-2 place-items-center hover:border-green-500 ${user && user.full_name == u.full_name && "border-green-500"}`}
              onClick={() => setUser(u)}
            >
              <div>{u.full_name}</div>
            </button>
          ))}
        </div>
        {user && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select a week:
            <select
              className="border border-green-500 text-green-500 text-sm text-center rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              onChange={(e) => setWeek(parseInt(e.target.value))}
            >
              <option selected />
              {[...Array(36)].map((_, w) => (
                <option value={w + 1}>{w + 1}</option>
              ))}
            </select>
          </label>
        )}
        {user && week && (
          <div style={{ width: "90%" }}>
            <ProgressSpreadsheet
              admin
              userId={user?.id as string}
              courseId="wdx-180"
              week={week}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl">
        <span className="text-gray-400">Admin</span>{" "}
        <span className="text-green-500">Dashboard</span>
      </h1>
      {content}
    </div>
  );
}
