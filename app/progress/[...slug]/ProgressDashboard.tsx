"use client";

import React from "react";
import { useParams } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { parseProgressParams } from "@/lib/parsers";
import { useProgressDraftQuery } from "@/hooks/useProgressDraftQuery";

type ProgressDashboardProps = {
  user: User;
};

export default function ProgressDashboard(props: ProgressDashboardProps) {
  const { week, day } = parseProgressParams(
    useParams<{ slug: string[] }>().slug
  );

  const {
    data: progressDrafts,
    isLoading,
    isError,
  } = useProgressDraftQuery(week, day);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !progressDrafts) {
    return <div>Supabase Error</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      {!week && !day ? (
        <h1 className="font-bold text-4xl text-red-500">Error 404 Here</h1>
      ) : (
        <>
          <h1 className="font-bold text-4xl text-green-500">Progress</h1>
          {day ? (
            <h2 className="text-3xl text-gray-400">
              Week: {week} and Day: {day}
            </h2>
          ) : (
            <h2 className="text-3xl text-gray-400">Week: {week}</h2>
          )}
          <div>
            {progressDrafts?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Concept</th>
                    <th>Task</th>
                    <th>Level</th>
                    <th>Instructions</th>
                    <th>Confidence</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {progressDrafts?.map((progress, idx) => (
                    <tr key={`p_${idx}`}>
                      <th>{progress.day}</th>
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
        </>
      )}
    </div>
  );
}
