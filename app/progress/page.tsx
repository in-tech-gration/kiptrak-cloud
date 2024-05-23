"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [progress, setProgress] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data: progressDraft } = await supabase
        .from("progress_draft")
        .select();
      setProgress(progressDraft);
    };
    getData();
  }, []);

  return <pre>{JSON.stringify(progress, null, 2)}</pre>;
}
