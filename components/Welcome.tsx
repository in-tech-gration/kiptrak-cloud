"use client";

import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Welcome() {
  const { session, isLoading, error } = useSessionContext();

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

      {isLoading ? (
        <RotatingLines width="50" />
      ) : // TODO: Create a Logged-in User Page:
      session?.user ? (
        <h2>
          Don't waste any more time and hop on to the{" "}
          <Link href="/progress" className="font-bold hover:underline">
            <span className="text-gray-400">Progress</span>{" "}
            <span className="text-green-500">Dashboard</span>
          </Link>
        </h2>
      ) : error ? (
        <div>Error {error.name}</div>
      ) : (
        // TODO: Create a Login Page:
        <h2>
          Please{" "}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>{" "}
          in order to access your{" "}
          <span className="text-gray-400">Progress</span>{" "}
          <span className="text-green-500">Dashboard</span>
        </h2>
      )}
    </div>
  );
}
