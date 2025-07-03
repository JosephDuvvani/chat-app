"use client";

import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { shadesOfPurple } from "@clerk/themes";

export default function ClerkProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useIsDarkMode();
  return (
    <OriginalClerkProvider
      appearance={isDarkMode ? { baseTheme: [shadesOfPurple] } : undefined}
    >
      {children}
    </OriginalClerkProvider>
  );
}
