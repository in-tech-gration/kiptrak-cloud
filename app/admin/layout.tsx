import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16 bg-gray-900">
        <span className="text-gray-400 text-2xl font-bold">Admin</span>
        <span className="text-green-500 text-2xl font-bold">Dashboard</span>
      </nav>

      <div className="flex-1 w-full flex flex-col gap-20 justify-center items-center">
        {children}
      </div>
    </>
  );
}
