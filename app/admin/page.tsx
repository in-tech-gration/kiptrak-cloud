"use client";

import React from "react";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import CoursesGrid from "@/components/CoursesGrid";
import { RotatingLines } from "react-loader-spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AdminPage() {
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

  return (
    <>
      <CoursesGrid baseUrl="/admin" />
    </>
  );
}
