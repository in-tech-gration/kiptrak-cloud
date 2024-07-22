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
import { useEffect, useState } from "react";
import "react-datasheet-grid/dist/style.css";
import { Progress } from "@/utils/supabase/types";
import { useProgressQuery } from "@/hooks/useProgressQuery";
import { useProgressUpdate } from "@/hooks/useProgressUpdate";
import { SelectComponent, SelectOptions } from "./SelectComponent";

type ProgressSpreadsheetProps = {
  userId: string;
  courseId: string;
  week?: number;
  day?: number;
};

export const ProgressSpreadsheet = (props: ProgressSpreadsheetProps) => {
  const { userId, courseId, week, day } = props;
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

  const selectColumn = (
    options: SelectOptions
  ): Column<string | null, SelectOptions> => ({
    // TODO: TypeScript
    // @ts-expect-error: Take care of this:
    component: SelectComponent,
    columnData: options,
    disableKeys: true,
    keepFocus: true,
    disabled: options.disabled,
    deleteValue: () => null,
    copyValue: ({ rowData }) =>
      options.choices.find((choice) => choice.value === rowData)?.label ?? null,
    pasteValue: ({ value }) =>
      options.choices.find((choice) => choice.label === value)?.value ?? null,
  });

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
      ...keyColumn(
        "level",
        selectColumn({
          choices: [
            { value: "Beginner", label: "Beginner" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ],
        })
      ),
      title: "Level",
      disabled: true,
      grow: 0.5,
    },
    {
      ...keyColumn("instructions", textColumn),
      disbled: true,
      title: "Instructions",
      grow: 3,
    },
    {
      ...keyColumn("confidence", intColumn),
      title: "Confidence",
      grow: 0.5,
    },
    {
      ...keyColumn("completed", checkboxColumn),
      title: "Completed",
      grow: 0.5,
    },
  ];

  const updateButtonHidden = data === progress;
  const handleSpreadsheetUpdate = () => {
    mutation.mutate(progress);
  };

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
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
