"use client";

import React from "react";
import ProgressGrid from "@/components/ProgressGrid";
import { RotatingLines } from "react-loader-spinner";
import { redirect, useSearchParams } from "next/navigation";
import { useCourseQuery } from "@/hooks/useCourseQuery";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ProgressSpreadsheet } from "@/components/ProgressSpreadsheet";

export default function ProgressDashboard({ courseId }: { courseId: string }) {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const searchParams = useSearchParams();

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  const day = searchParams.get("day");
  const week = searchParams.get("week");

  const { data: course, isLoading, isError, error } = useCourseQuery(courseId);

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
    return (
      <ProgressGrid
        course={course}
        baseUrl="/progress"
        userId={session.user.id}
      />
    );
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
          week={week ? +week : undefined}
          day={day ? +day : undefined}
        />
      </div>
    </div>
  );
}
