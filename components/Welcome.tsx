import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Welcome() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      {user ? (
        <h2>
          Don't waste any more time and hop on to the{" "}
          <Link href="/progress" className="font-bold hover:underline">
            <span className="text-gray-400">Progress</span>{" "}
            <span className="text-green-500">Dashboard</span>
          </Link>
        </h2>
      ) : (
        <h2>
          Please{" "}
          <Link href="/login" className="font-bold hover:underline">
            LogIn
          </Link>{" "}
          in order to access your{" "}
          <span className="text-gray-400">Progress</span>{" "}
          <span className="text-green-500">Dashboard</span>
        </h2>
      )}
    </div>
  );
}
