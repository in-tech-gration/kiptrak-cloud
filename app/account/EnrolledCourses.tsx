"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { Course } from "@/utils/supabase/types";
import { RotatingLines } from "react-loader-spinner";
import { useCoursesQuery } from "@/hooks/useCoursesQuery";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { enrollCourseMutation } from "@/hooks/enrollCourseMutation";
import { useEnrolledCoursesQuery } from "@/hooks/useEnrolledCoursesQuery";

type EnrollCourseModal = {
  modal: boolean;
  course: Course | undefined;
};

export default function EnrolledCourses() {
  const { session, isLoading: sessionLoading } = useSessionContext();

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

  const [courseToEnroll, setCourseToEnroll] = useState({
    modal: false,
    course: undefined,
  } as EnrollCourseModal);

  const handleEnrollCourse = (userId: string, courseId: string) => {
    courseMutation.mutate({ userId, courseId });
    setCourseToEnroll({ course: undefined, modal: false });
  };

  const enrollDisabled = (courseId: string) => {
    if (enrolledCourses) {
      return enrolledCourses.find((c) => c.id === courseId) != undefined;
    }
    return false;
  };

  if (sessionLoading) {
    return <RotatingLines width="50" />;
  }

  if (!sessionLoading && !session?.user) {
    redirect("/login");
  }

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
                      setCourseToEnroll({ course: course, modal: true })
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

      {courseToEnroll.modal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Enroll to {courseToEnroll.course?.name}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() =>
                      setCourseToEnroll({ course: undefined, modal: false })
                    }
                  >
                    <span className="bg-transparent text-white hover:text-red-500 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    You are about to enroll to course{" "}
                    <span className="text-green-400 font-bold">
                      {courseToEnroll.course?.name}
                    </span>
                    .
                  </p>
                  <p className="text-blueGray-500 text-lg text-center leading-relaxed">
                    Do you want to proceed?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 rounded-b">
                  <button
                    className="bg-red-500 text-white font-bold px-6 py-3 rounded hover:bg-red-900 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>
                      setCourseToEnroll({ course: undefined, modal: false })
                    }
                  >
                    No
                  </button>
                  <button
                    className="bg-green-400 text-white font-bold text-sm px-6 py-3 rounded hover:bg-green-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>
                      handleEnrollCourse(
                        session?.user.id as string,
                        courseToEnroll.course?.id as string
                      )
                    }
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
