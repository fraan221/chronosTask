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
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 w-full mb-6">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-bold text-lg hidden sm:inline-block">
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
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
