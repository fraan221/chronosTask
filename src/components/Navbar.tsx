"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconClock, IconHistory, IconKeyboard } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Tracking",
      icon: IconClock,
    },
    {
      href: "/history",
      label: "Historial",
      icon: IconHistory,
    },
    {
      href: "/shortcuts",
      label: "Atajos",
      icon: IconKeyboard,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full mb-8 pt-4 px-4 pointer-events-none">
      <div className="container mx-auto max-w-5xl pointer-events-auto">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm rounded-full px-2 h-14 flex items-center justify-between">
          <div className="flex items-center pl-4">
            <h1 className="font-bold text-base tracking-tight hidden sm:inline-block bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              ChronosTask
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5",
                  )}
                >
                  <Icon className="h-4 w-4" stroke={2} />
                  <span className={cn("hidden sm:inline", isActive && "inline")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
