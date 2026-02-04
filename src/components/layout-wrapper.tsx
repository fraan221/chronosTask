"use client";

import { useSearchParams } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isZenMode = searchParams.get("zen") === "true";

  if (isZenMode) {
    return null;
  }

  return <>{children}</>;
}
