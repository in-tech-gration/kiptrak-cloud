"use client";

import React from "react";
import { type User } from "@supabase/supabase-js";
import { useCourseQuery } from "@/hooks/useCourseQuery";
import { useEnrolledCoursesQuery } from "@/hooks/useEnrolledCoursesQuery";

export default function EnrolledCourses(props: { user: User }) {
  const { user } = props;

  const {
    data: totalCourses,
    isError: coursesIsError,
    isLoading: coursesIsLoading,
  } = useCourseQuery();
  const {
    data: enrolledCourses,
    isError: enrolledIsError,
    isLoading: enrolledIsLoading,
  } = useEnrolledCoursesQuery(user.id);

  return (
    <div className="flex flex-col justify-center">
      {enrolledIsLoading ? (
        <div>Loading....</div>
      ) : enrolledIsError || !enrolledCourses ? (
        <div>Supabase Error</div>
      ) : (
        <div>
          <h2 className="text-center font-bold text-3xl p-2">
            Enrolled Courses
          </h2>
          {enrolledCourses.map((enrolledCourse, index) => (
            <div
              key={`enrolled-course-${index}`}
              className="flex justify-evenly"
            >
              <div className="flex flex-col text-gray-400">
                <div>Name:</div>
              </div>
              <div className="flex flex-col text-center text-green-500 font-bold">
                <div>{enrolledCourse.course_name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {coursesIsLoading ? (
        <div>Loading....</div>
      ) : coursesIsError || !totalCourses ? (
        <div>Supabase Error</div>
      ) : (
        <div className="border-t border-t-foreground/10 mt-3">
          <h2 className="text-center font-bold text-3xl p-2">
            Available Courses
          </h2>
          {totalCourses.map((course, index) => (
            <div key={`course-${index}`} className="flex justify-evenly">
              <div className="flex flex-col text-gray-400">
                <div>Name:</div>
                <div>Description:</div>
                <div>Length:</div>
                <div>Technologies covered:</div>
              </div>
              <div className="flex flex-col text-center text-green-500 font-bold">
                <div>{course.name}</div>
                <div>{course.description}</div>
                <div>{course.length} weeks</div>
                <div>
                  {course.technologies.map((technology) => `${technology} `)}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {/* TODO: Create a ReactQuery mutate Hook to alter the joined table rel_profiles_course */}
                <button className="p-2 rounded font-bold bg-green-500 hover:bg-green-700">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
