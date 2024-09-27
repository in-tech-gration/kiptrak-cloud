"use client";

import React from "react";
import { useCoursesQuery } from "@/hooks/useCoursesQuery";
import Link from "next/link";

export default function CoursesGrid({ baseUrl }: { baseUrl: string }) {
  const { data: courses, isError, isLoading } = useCoursesQuery();

  if (isLoading) {
    return <div>Loading Courses...</div>;
  }

  if (isError) {
    return <div>Error fetching Courses</div>;
  }

  return (
    <>
      <h2 className="text-center font-bold text-3xl p-2 text-gray-400">
        Available Courses
      </h2>
      <div className="grid gap-4 place-items-center w-1/6">
        {courses?.map((c, index) => (
          <Link
            href={`${baseUrl}/${c.id}`}
            key={`course-button-${index}`}
            className={`grid gap-2 bg-gray-900 border-4 text-green-500 rounded p-2 place-items-center hover:border-green-500 w-full`}
          >
            <div>{c.name}</div>
            <div>{c.length} weeks</div>
          </Link>
        ))}
      </div>
    </>
  );
}
