"use client";

import React from "react";
import Link from "next/link";
import { Course } from "@/utils/supabase/types";
import { useWeeklyProgressQuery } from "@/hooks/useWeeklyProgressHook";
import { RotatingLines } from "react-loader-spinner";
import { colorsForTaskCompletion } from "@/lib/utils";

type ProgressGridProps = {
  userId: string;
  course: Course;
  baseUrl: string;
};

export default function ProgressGrid(props: ProgressGridProps) {
  const { userId, course, baseUrl } = props;

  const { data, isLoading, error } = useWeeklyProgressQuery(userId);

  if (isLoading) {
    return <RotatingLines width="50" />;
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        <h1 className="font-bold text-4xl text-red-500">
          Supabase Error: ${error?.message}
        </h1>
      </div>
    );
  }

  const userIdParam = baseUrl === "/admin" ? `userId=${userId}&` : "";

  const days = 5;
  const colors = data
    ? colorsForTaskCompletion(data, course.length, days)
    : [[]];

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl text-green-500">{course.name}</h1>
      <div className="grid 3xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {[...Array(course.length)].map((_, week) => (
          <div
            key={`week_${week + 1}`}
            className="grid grid-cols-1 place-items-center bg-gray-900 rounded shadow-md outline outline-gray-400"
          >
            <p className="font-bold text-green-500">Week {week + 1}</p>
            <p className="font-bold text-green-500">Days:</p>
            <div className="p-4 ">
              <div className="flex ">
                {[...Array(days)].map((_, day) => (
                  <Link
                    key={`week_${week + 1}_${day + 1}`}
                    className={`${colors[week][day]} text-white py-2 mx-1 rounded text-center h-10 w-10`}
                    href={`${baseUrl}/${course.id}?${userIdParam}week=${week + 1}&day=${day + 1}`}
                  >
                    {day + 1}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
