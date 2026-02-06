"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatTimeVerbose } from "@/lib/time";
import { IconClockHour4, IconTrophy } from "@tabler/icons-react";

interface DailySummaryProps {
  totalSeconds: number;
  activeTimers: number;
}

export function DailySummary({
  totalSeconds,
  activeTimers,
}: DailySummaryProps) {
  const hours = Math.floor(totalSeconds / 3600);

  // Mensaje motivacional basado en horas trabajadas
  const getMessage = () => {
    if (totalSeconds === 0) return "¡Comienza tu jornada!";
    if (hours < 1) return "¡Buen comienzo!";
    if (hours < 4) return "¡Sigue así!";
    if (hours < 6) return "¡Excelente progreso!";
    if (hours < 8) return "¡Casi terminas!";
    return "¡Increíble jornada!";
  };

  return (
    <Card className="border-0 shadow-sm bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden relative group ring-1 ring-border/50">
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
              <IconClockHour4 className="h-4 w-4" />
              <h2 className="font-semibold tracking-widest text-xs uppercase">
                Tiempo Total Hoy
              </h2>
            </div>
            <div className="text-6xl sm:text-7xl font-bold tracking-tighter tabular-nums leading-none text-foreground">
              {formatTime(totalSeconds)}
            </div>
            <p className="text-muted-foreground font-medium pl-1 text-sm mt-2">
              {formatTimeVerbose(totalSeconds)} de enfoque
            </p>
          </div>

          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 text-primary border border-primary/10 transition-colors hover:bg-primary/10">
              <IconTrophy className="h-4 w-4" />
              <span className="font-semibold text-sm">{getMessage()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
