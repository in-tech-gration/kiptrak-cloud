import React from "react";

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-5 justify-center items-center">
        {children}
      </div>
    </>
  );
}
