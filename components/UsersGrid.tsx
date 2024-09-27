"use client";

import React from "react";
import Link from "next/link";
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
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center w-1/4">
        {users?.map((user, index) => (
          <Link
            href={`/admin/${courseId}?userId=${user.id}`}
            key={`course-button-${index}`}
            className={`grid gap-2 bg-gray-900 border-4 text-yellow-400 rounded p-2 place-items-center hover:border-yellow-400 w-full`}
          >
            <div>{user.full_name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
