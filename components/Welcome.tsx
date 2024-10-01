"use client";

import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Welcome() {
  const { session, isLoading, error } = useSessionContext();

  if (isLoading) {
    return (
      <>
        <RotatingLines width="50" />
        <p className="italic text-lime-500">
          (If the loading persists for more than a minute or two, please contact
          a member of the staff)
        </p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p className="font-bold text-red-500">Error: {error.name}</p>
        <p className="font-bold text-red-500">{error.message}</p>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="font-bold text-4xl">
        Welcome to <span className="text-gray-400">Kip</span>
        <span className="text-green-500">Trak</span> Cloud
      </h1>
      <p className="text-lg !leading-tight mx-auto max-w-xl text-center">
        The ideal tool to keep track of your progress
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      {session?.user && (
        <>
          <h2 className="text-2xl">It's so nice to see you again!</h2>
          <p className="text-xl">
            Don't waste any more time and start keeping track of your progress!
          </p>
          <Link
            href="/progress"
            className="font-bold text-lg text-green-500 hover:text-green-700 border-4 rounded border-green-500 hover:border-green-700 p-3"
          >
            Progress Dashboard
          </Link>
          <p className="italic text-gray-400">
            If you have not enrolled to any course, please visit your{" "}
            <Link href="/account" className="text-green-300">
              account page!
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
