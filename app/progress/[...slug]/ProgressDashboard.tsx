"use client";

import React from "react";
import { redirect, useParams } from "next/navigation";
import { parseProgressParams } from "@/lib/parsers";
import { useUser } from "@supabase/auth-helpers-react";
import { useCourseQuery } from "@/hooks/useCourseQuery";
import { ProgressSpreadsheet } from "@/components/ProgressSpreadsheet";

export default function ProgressDashboard() {
  const user = useUser();

  if (!user) {
    redirect("/login");
  }

  const { courseId, day, week } = parseProgressParams(
    useParams<{ slug: string[] }>().slug
  );

  if (!courseId || !week) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">Error 404 Here</h1>
      </div>
    );
  }

  const { data: course, isLoading, isError, error } = useCourseQuery(courseId);

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError || !course) {
    content = (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">
          Supabase Error: ${error?.message}
        </h1>
      </div>
    );
  } else {
    content = (
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
            userId={user.id}
            courseId={course.id}
            week={week}
            day={day}
          />
        </div>
        {/* TODO: Add previous and next buttons for better user experience */}
      </div>
    );
  }

  return content;
}
