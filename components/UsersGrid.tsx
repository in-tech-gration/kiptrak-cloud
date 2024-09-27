"use client";

import React from "react";
import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import { useEnrolledUsersQuery } from "@/hooks/useEnrolledUsersQuery";
import { Profile } from "@/utils/supabase/types";

type UserGridParams = {
  courseId: string;
  users: Partial<Profile>[];
};

export default function UsersGrid(props: UserGridParams) {
  const { courseId, users } = props;

  return (
    <>
      <h2 className="text-center font-bold text-3xl p-2 text-gray-400">
        Users
      </h2>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center">
        {users?.map((user, index) => (
          <Link
            href={`/admin/${courseId}?userId=${user.id}`}
            key={`course-button-${index}`}
            className={`grid gap-2 bg-white border-4 text-green-500 rounded p-2 place-items-center hover:border-green-500`}
          >
            <div>{user.full_name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
