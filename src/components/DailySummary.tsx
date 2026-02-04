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
    <Card className="border-0 shadow-lg bg-linear-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
      <CardContent className="p-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-4">
              <IconClockHour4 className="h-5 w-5" />
              <h2 className="font-medium tracking-wide text-xs uppercase opacity-90">
                Total Hoy
              </h2>
            </div>
            <div className="text-6xl sm:text-7xl font-bold tracking-tighter tabular-nums leading-none">
              {formatTime(totalSeconds)}
            </div>
            <p className="text-primary-foreground/70 font-medium pl-1">
              {formatTimeVerbose(totalSeconds)} de enfoque
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 shadow-sm">
              <IconTrophy className="h-4 w-4 text-yellow-300" />
              <span className="font-medium text-sm">{getMessage()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
