// cSpell: disable
"use client";

import {
  DataSheetGrid,
  checkboxColumn,
  intColumn,
  textColumn,
  keyColumn,
  Column,
} from "react-datasheet-grid";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import "react-datasheet-grid/dist/style.css";
import { Progress } from "@/utils/supabase/types";
import { RotatingLines } from "react-loader-spinner";
import { useProgressQuery } from "@/hooks/useProgressQuery";
import { useProgressUpdate } from "@/hooks/useProgressUpdate";

type ProgressSpreadsheetProps = {
  userId: string;
  courseId: string;
  week?: number;
  day?: number;
  admin?: boolean;
};

export const ProgressSpreadsheet = (props: ProgressSpreadsheetProps) => {
  const { userId, courseId, week, day, admin } = props;
  const [progress, setProgress] = useState<Progress[]>([]);
  const { data, isLoading, isError, error } = useProgressQuery(
    userId,
    courseId,
    week,
    day
  );

  const mutation = useProgressUpdate();

  useEffect(() => {
    if (data) {
      setProgress(data);
    }
  }, [data]);

  const columns = [
    {
      ...keyColumn("concept", textColumn),
      disabled: true,
      title: "Concept",
    },
    {
      ...keyColumn("task", textColumn),
      disabled: true,
      title: "Task",
      grow: 2.5,
    },
    {
      ...keyColumn("level", textColumn),
      title: "Level",
      disabled: true,
      grow: 0.5,
    },
    {
      ...keyColumn("instructions", textColumn),
      disabled: admin,
      title: "Instructions",
      grow: 3,
    },
    {
      ...keyColumn("confidence", intColumn),
      disabled: admin,
      title: "Confidence",
      grow: 0.5,
    },
    {
      ...keyColumn("completed", checkboxColumn),
      disabled: admin,
      title: "Completed",
      grow: 0.5,
    },
  ];

  const updateButtonHidden = admin || data === progress;
  const handleSpreadsheetUpdate = () => {
    let valid = true;
    progress.forEach((prog) => {
      if (prog.confidence < 0 || prog.confidence > 10) {
        valid = false;
        toast.error(
          "Confidence should be between 0 and 10. Please provide correct information."
        );
        return;
      }
    });
    if (valid) {
      mutation.mutate(progress);
    }
  };

  let content;

  if (isLoading) {
    content = <RotatingLines width="50" />;
  } else if (isError) {
    content = <div>{error.message}</div>;
  } else {
    content = (
      <>
        <DataSheetGrid<Progress>
          lockRows
          value={progress}
          onChange={(value) => {
            setProgress(value);
          }}
          columns={columns as Column<Progress>[]}
        />
        {!updateButtonHidden && (
          <button
            className="float-right rounded bg-green-500 p-2 mt-1"
            onClick={handleSpreadsheetUpdate}
          >
            {!mutation.isPending ? (
              "Update"
            ) : (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            )}
          </button>
        )}
      </>
    );
  }

  return content;
};
