"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useCoursesQuery } from "@/hooks/useCoursesQuery";
import { Course } from "@/utils/supabase/types";

type CourseListProps = {
  course?: Course;
  setCourse: Dispatch<SetStateAction<Course | undefined>>;
};

export default function CoursesGrid(props: CourseListProps) {
  const { course, setCourse } = props;
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
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center">
        {courses?.map((c, index) => (
          <button
            key={`course-button-${index}`}
            className={`grid gap-2 bg-white border-4 text-green-500 rounded p-2 place-items-center hover:border-green-500 ${course && course.name == c.name && "border-green-500"}`}
            onClick={() => setCourse(c)}
          >
            <div>{c.name}</div>
            <div>{c.length} weeks</div>
          </button>
        ))}
      </div>
    </>
  );
}
