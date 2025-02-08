"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // To keep track of wether or not component has been mounted.
  const [mounted, setMounted] = React.useState(false);

  // Sets true when component has been mounted.
  React.useEffect(() => {
    setMounted(true);
  }, []); // empty array to only render once on mount.

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
