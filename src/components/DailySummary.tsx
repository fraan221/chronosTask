"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/time";
import { IconClockHour4 } from "@tabler/icons-react";

interface DailySummaryProps {
  totalSeconds: number;
  activeTimers: number;
}

export function DailySummary({
  totalSeconds,
}: DailySummaryProps) {
  return (
    <Card className="border-0 shadow-sm bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden relative group ring-1 ring-border/50">
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <IconClockHour4 className="h-4 w-4" />
              <h2 className="font-semibold tracking-widest text-xs uppercase">
                Tiempo Total Hoy
              </h2>
            </div>
            <div className="text-6xl sm:text-7xl font-bold tracking-tighter tabular-nums leading-none text-foreground">
              {formatTime(totalSeconds)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
