import { Course } from "@/utils/supabase/types";
import Link from "next/link";
import React from "react";

type ProgressGridProps = {
  course: Course;
};

export default function ProgressGrid(props: ProgressGridProps) {
  const { course } = props;

  return (
    <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
      <h1 className="font-bold text-4xl">
        <span className="text-gray-400">Course</span>:{" "}
        <span className="text-green-500">{course.name}</span>
      </h1>
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
                <Link
                  className="bg-green-500 text-white py-2 mx-1 rounded text-center h-10 w-10"
                  href={`/progress/${course.id}/${i + 1}`}
                >
                  *
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
