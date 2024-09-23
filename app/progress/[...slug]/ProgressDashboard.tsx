"use client";

import React from "react";
import { parseProgressParams } from "@/lib/parsers";
import ProgressGrid from "@/components/ProgressGrid";
import { RotatingLines } from "react-loader-spinner";
import { redirect, useParams } from "next/navigation";
import { useCourseQuery } from "@/hooks/useCourseQuery";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ProgressSpreadsheet } from "@/components/ProgressSpreadsheet";

export default function ProgressDashboard() {
  const { session, isLoading: sessionLoading } = useSessionContext();

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  const { courseId, day, week } = parseProgressParams(
    useParams<{ slug: string[] }>().slug
  );

  if (!courseId) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">Error 404 Here</h1>
      </div>
    );
  }

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useCourseQuery(courseId as string);

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

  if (course && !week && !day && session?.user.id) {
    return <ProgressGrid userId={session.user.id} course={course} />;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl">
        <span className="text-gray-400">{course.name}'s</span>{" "}
        <span className="text-green-500">Progress</span>
      </h1>
      {day ? (
        <h2 className="text-3xl text-gray-400">
          Week: {week} and Day: {day}
        </h2>
      ) : (
        <h2 className="text-3xl text-gray-400">Week: {week}</h2>
      )}
      <div style={{ width: "90%" }}>
        <ProgressSpreadsheet
          userId={session?.user.id as string}
          courseId={course.id}
          week={week}
          day={day}
        />
      </div>
      {/* TODO: Add previous and next buttons for better user experience */}
    </div>
  );
}
