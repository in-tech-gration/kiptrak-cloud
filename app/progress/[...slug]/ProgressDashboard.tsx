"use client";

import React from "react";
import { useParams } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { parseProgressParams } from "@/lib/parsers";
import { useProgressQuery } from "@/hooks/useProgressQuery";
import { useCourseQuery } from "@/hooks/useCourseQuery";

export default function ProgressDashboard(props: { user: User }) {
  const { user } = props;
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

  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseQuery(courseId);

  const {
    data: progress,
    isLoading: progressLoading,
    isError: progressError,
  } = useProgressQuery(user.id, courseId, week, day);

  if (courseLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  if (progressError || courseError || !progress || !course) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">Supabase Error</h1>
      </div>
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
      <div>
        {/* TODO: Make this editable */}
        {progress?.length ? (
          <table>
            <thead>
              <tr>
                {!day && <th>Day</th>}
                <th>Concept</th>
                <th>Task</th>
                <th>Level</th>
                <th>Instructions</th>
                <th>Confidence</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {progress?.map((progress, idx) => (
                <tr key={`p_${idx}`}>
                  {!day && <th>{progress.day}</th>}
                  <th>{progress.concept}</th>
                  <th>{progress.task}</th>
                  <th>{progress.level}</th>
                  <th>{progress.instructions}</th>
                  <th>{progress.confidence}</th>
                  <th>{progress.completed}</th>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h3 className="font-bold text-2xl italic text-red-500">
            No content found
          </h3>
        )}
      </div>
      {/* TODO: Add previous and next buttons for better user experience */}
    </div>
  );
}
