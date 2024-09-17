"use client";

import React from "react";
import Link from "next/link";
import { Course } from "@/utils/supabase/types";

type ProgressGridProps = {
  course: Course;
};

export default function ProgressGrid(props: ProgressGridProps) {
  const course = props.course;

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl text-green-500">{course.name}</h1>
      <div className="grid 3xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {[...Array(course.length)].map((_, i) => (
          <div
            key={`week_${i + 1}`}
            className="grid grid-cols-1 place-items-center bg-white rounded shadow-md outline outline-gray-400"
          >
            <p className="font-bold text-green-500">Week {i + 1}</p>
            <p className="font-bold text-green-500">Days:</p>
            <div className="p-4 ">
              <div className="flex ">
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}/1`}
                >
                  1
                </Link>
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}/2`}
                >
                  2
                </Link>
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}/3`}
                >
                  3
                </Link>
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}/4`}
                >
                  4
                </Link>
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}/5`}
                >
                  5
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}