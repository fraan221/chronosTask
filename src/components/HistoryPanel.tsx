"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DailyRecord } from "@/types/timer";
import { formatTime, formatDate, formatTimeVerbose } from "@/lib/time";
import { IconHistory, IconCalendar } from "@tabler/icons-react";

interface HistoryPanelProps {
  history: DailyRecord[];
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  // Ordenar por fecha descendente (más reciente primero)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sortedHistory.length === 0) {
    return (
      <Card className="border shadow-sm bg-card">
        <CardHeader className="pb-3 pt-6">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <IconHistory className="h-5 w-5 text-muted-foreground/70" />
            <span className="text-foreground/80">Historial</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/60 gap-3 border-2 border-dashed border-muted rounded-lg bg-muted/5">
            <div className="p-3 bg-muted/20 rounded-full">
              <IconCalendar className="h-6 w-6 opacity-40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/70">
                Sin registros
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas
  const totalAllTime = sortedHistory.reduce(
    (acc, d) => acc + d.totalSeconds,
    0,
  );
  const averagePerDay =
    sortedHistory.length > 0
      ? Math.round(totalAllTime / sortedHistory.length)
      : 0;

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-8 pt-2 px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <IconHistory className="h-4 w-4" />
            Registro de Actividad
          </CardTitle>
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium border border-border/50">
            {sortedHistory.length} días registrados
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-white/5 backdrop-blur-sm text-center transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 shadow-sm">
            <div className="text-3xl font-bold font-mono tracking-tighter text-primary">
              {formatTimeVerbose(totalAllTime)}
            </div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground/70 mt-2 tracking-wide">
              Total Histórico
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-white/5 backdrop-blur-sm text-center transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 shadow-sm">
            <div className="text-3xl font-bold font-mono tracking-tighter text-primary">
              {formatTimeVerbose(averagePerDay)}
            </div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground/70 mt-2 tracking-wide">
              Promedio Diario
            </div>
          </div>
        </div>

        {/* Lista de días */}
        <div className="space-y-3">
          {sortedHistory.map((record) => (
            <div
              key={record.date}
              className="group flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-border/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                  <IconCalendar className="h-5 w-5" stroke={1.5} />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground">
                    {formatDate(record.date)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                   {record.timers.length} {record.timers.length !== 1 ? "sesiones" : "sesión"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-foreground/90 tracking-tight">
                  {formatTime(record.totalSeconds)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
