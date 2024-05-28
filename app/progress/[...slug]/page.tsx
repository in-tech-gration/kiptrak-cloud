"use client";

import { parseProgressParams } from "@/lib/parsers";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressByWeekAndDay() {
  const { week, day } = parseProgressParams(
    useParams<{ slug: string[] }>().slug
  );
  const supabase = createClient();

  const [progressData, setProgressData] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (day) {
        const { data: progress } = await supabase
          .from("progress_draft")
          .select()
          .eq("week", week)
          .eq("day", day);
        setProgressData(progress);
      } else {
        const { data: progress } = await supabase
          .from("progress_draft")
          .select()
          .eq("week", week);
        setProgressData(progress);
      }
    };

    getData();
  }, [week, day]);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      {!week && !day ? (
        <h1 className="font-boldd text-4xl text-red-500">Error 404 Here</h1>
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
