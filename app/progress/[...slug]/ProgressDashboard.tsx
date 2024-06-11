"use client";

import { useParams } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { parseProgressParams } from "@/lib/parsers";
import { ProgressDraft } from "@/utils/supabase/types";
import { getProgressDraft } from "@/utils/api-requests";

type ProgressDashboardProps = {
  user: User;
};

export default function ProgressDashboard(props: ProgressDashboardProps) {
  const { week, day } = parseProgressParams(
    useParams<{ slug: string[] }>().slug
  );

  const client = useSupabase();

  const [progressData, setProgressData] = useState<ProgressDraft[] | null>(
    null
  );

  useEffect(() => {
    if (week) {
      getProgressDraft(client, week, day)
        .then((data) => setProgressData(data))
        .catch((error) => console.log(error));
    }
  }, [week, day]);

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
            {progressData?.length ? (
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
                  {progressData?.map((progress, idx) => (
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
