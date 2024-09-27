"use client";

import React from "react";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";
import { useCourseQuery } from "@/hooks/useCourseQuery";
import { redirect, useSearchParams } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import UsersGrid from "@/components/UsersGrid";
import { useEnrolledUsersQuery } from "@/hooks/useEnrolledUsersQuery";
import { ProgressSpreadsheet } from "@/components/ProgressSpreadsheet";
import ProgressGrid from "@/components/ProgressGrid";

export default function AdminDashboard({ courseId }: { courseId: string }) {
  const {
    data: enrolledUsers,
    isError: eUsersIsError,
    error: eUsersError,
    isLoading: eUsersIsLoading,
  } = useEnrolledUsersQuery(courseId);
  const { data: course, isLoading, isError, error } = useCourseQuery(courseId);
  const { session, isLoading: sessionLoading } = useSessionContext();
  const searchParams = useSearchParams();

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

  if (isLoading) {
    return <RotatingLines width="50" />;
  }

  if (isError || !course) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">
          Supabase Error: ${error?.message}
        </h1>
      </div>
    );
  }

  const day = searchParams.get("day");
  const userId = searchParams.get("userId");
  const week = searchParams.get("week");

  if (userId === null) {
    if (eUsersIsLoading) {
      return <RotatingLines width="50" />;
    }

    if (eUsersIsError) {
      return (
        <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
          <h1 className="font-bold text-4xl text-red-500">
            Supabase Error: ${eUsersError?.message}
          </h1>
        </div>
      );
    }
    return (
      enrolledUsers && <UsersGrid courseId={course.id} users={enrolledUsers} />
    );
  }

  const selectedUser = enrolledUsers?.find((user) => user.id === userId);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl">{selectedUser?.full_name}</h1>
      {!week && !day ? (
        <ProgressGrid
          course={course}
          baseUrl="/admin"
          userId={userId as string}
        />
      ) : (
        <>
          <h2 className="font-bold text-3xl">
            <span className="text-gray-400">{course.name}'s</span>{" "}
            <span className="text-green-500">Progress</span>
          </h2>
          {day ? (
            <h2 className="text-3xl text-gray-400">
              Week: {week} and Day: {day}
            </h2>
          ) : (
            <h2 className="text-3xl text-gray-400">Week: {week}</h2>
          )}
          <div style={{ width: "90%" }}>
            <ProgressSpreadsheet
              userId={userId as string}
              courseId={course.id}
              week={week ? +week : undefined}
              day={day ? +day : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
}
