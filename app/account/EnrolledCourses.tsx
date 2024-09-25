"use client";

import React from "react";
import { redirect } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import { useCoursesQuery } from "@/hooks/useCoursesQuery";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { enrollCourseMutation } from "@/hooks/enrollCourseMutation";
import { useEnrolledCoursesQuery } from "@/hooks/useEnrolledCoursesQuery";

export default function EnrolledCourses() {
  const { session, isLoading: sessionLoading } = useSessionContext();

  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

  const {
    data: totalCourses,
    isError: coursesIsError,
    isLoading: coursesIsLoading,
  } = useCoursesQuery();
  const {
    data: enrolledCourses,
    isError: enrolledIsError,
    isLoading: enrolledIsLoading,
  } = useEnrolledCoursesQuery(session?.user.id as string);

  const courseMutation = enrollCourseMutation();

  const handleEnrollCourse = (userId: string, courseId: string) => {
    courseMutation.mutate({ userId, courseId });
  };

  const enrollDisabled = (courseId: string) => {
    if (enrolledCourses) {
      return enrolledCourses.find((c) => c.id === courseId) != undefined;
    }
    return false;
  };

  return (
    <div className="flex flex-col justify-center">
      {enrolledIsLoading ? (
        <RotatingLines width="50" />
      ) : enrolledIsError || !enrolledCourses ? (
        <div>Supabase Error</div>
      ) : enrolledCourses.length ? (
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
                <div>{enrolledCourse.name}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {coursesIsLoading ? (
        <RotatingLines width="50" />
      ) : coursesIsError || !totalCourses ? (
        <div>Supabase Error</div>
      ) : totalCourses.length !== enrolledCourses?.length ? (
        <>
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
              {!enrollDisabled(course.id) && (
                <div className="flex flex-col justify-center">
                  <button
                    className={
                      "p-2 rounded font-bold bg-green-500 hover:bg-green-700"
                    }
                    onClick={() =>
                      handleEnrollCourse(session?.user.id as string, course.id)
                    }
                  >
                    Enroll
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
