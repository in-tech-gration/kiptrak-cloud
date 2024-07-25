"use client";

import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AuthButton() {
  const { session, isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  return session?.user ? (
    <div className="flex items-center gap-4">
      <Link
        href="/account"
        className="font-bold hover:border hover:rounded hover:border-green-500 hover:text-gray-400 p-3"
      >
        {session.user.email}
      </Link>
      <SignOutButton />
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
