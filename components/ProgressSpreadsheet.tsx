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
import "react-datasheet-grid/dist/style.css";
import { useProgressQuery } from "@/hooks/useProgressQuery";
import { SelectComponent, SelectOptions } from "./SelectComponent";

type ProgressSpreadsheetProps = {
  userId: string;
  courseId: string;
  week?: number;
  day?: number;
};

export const ProgressSpreadsheet = (props: ProgressSpreadsheetProps) => {
  const { userId, courseId, week, day } = props;
  const { data, isLoading, isError, error } = useProgressQuery(
    userId,
    courseId,
    week,
    day
  );

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
    },
    {
      ...keyColumn("confidence", intColumn),
      title: "Confidence",
    },
    {
      ...keyColumn("completed", checkboxColumn),
      title: "Completed",
    },
    {
      ...keyColumn("instructions", textColumn),
      title: "Instructions",
    },
  ];

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>{error.message}</div>;
  } else {
    content = (
      <DataSheetGrid
        lockRows
        value={data}
        // TODO: Find the proper way with ReactQuery
        // onChange={refetch}
        columns={columns}
      />
    );
  }

  return content;
};
