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
    <Card className="border shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-3 pt-6 border-b border-border/40 bg-muted/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <IconHistory className="h-4 w-4" />
            Historial
          </CardTitle>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium border border-border/50">
            {sortedHistory.length} días
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 divide-x divide-border/40 border-b border-border/40 bg-muted/10">
          <div className="p-4 text-center hover:bg-muted/20 transition-colors">
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {formatTimeVerbose(totalAllTime)}
            </div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground/60 mt-1">
              Total Histórico
            </div>
          </div>
          <div className="p-4 text-center hover:bg-muted/20 transition-colors">
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {formatTimeVerbose(averagePerDay)}
            </div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground/60 mt-1">
              Media Diaria
            </div>
          </div>
        </div>

        {/* Lista de días */}
        <div className="max-h-88 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {sortedHistory.map((record) => (
            <div
              key={record.date}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50 mb-1 last:mb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <IconCalendar className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground/80">
                  {formatDate(record.date)}
                </span>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-sm font-mono font-bold text-foreground">
                  {formatTime(record.totalSeconds)}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-70">
                  {record.timers.length}{" "}
                  {record.timers.length !== 1 ? "sesiones" : "sesión"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
