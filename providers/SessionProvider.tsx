"use client";

import React from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = useSupabase();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
};
