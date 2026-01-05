"use client";

import { usePathname } from "next/navigation";
import TerminalHeader from "./TerminalHeader";

export default function RouteHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/immersive")) {
    return null;
  }

  return <TerminalHeader />;
}
