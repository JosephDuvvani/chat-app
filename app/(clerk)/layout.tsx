import React, { ReactNode } from "react";

export default function ClerkLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-svh">
      <div>{children}</div>
    </div>
  );
}
