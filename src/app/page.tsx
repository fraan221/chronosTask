"use client";

import { useTimers } from "@/hooks/useTimers";
import { TimerCard } from "@/components/TimerCard";
import { CreateTimerForm } from "@/components/CreateTimerForm";
import { DailySummary } from "@/components/DailySummary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconClock, IconPlayerStop, IconLoader2 } from "@tabler/icons-react";

export default function Home() {
  const {
    timers,
    isLoaded,
    totalTodaySeconds,
    addTimer,
    removeTimer,
    toggleTimer,
    resetTimer,
    stopAllTimers,
  } = useTimers();

  const activeTimersCount = timers.filter((t) => t.isRunning).length;

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <IconLoader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 space-y-6 max-w-7xl">
      {/* Resumen del día */}
      <DailySummary
        totalSeconds={totalTodaySeconds}
        activeTimers={activeTimersCount}
      />

      <Separator />

      {/* Sección de Timers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <IconClock className="h-5 w-5 text-primary" />
            Mis Timers
          </h2>
          <div className="flex items-center gap-3">
            {activeTimersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopAllTimers}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              >
                <IconPlayerStop className="h-4 w-4 mr-2" />
                Detener todos
              </Button>
            )}
            <CreateTimerForm onCreateTimer={addTimer} />
          </div>
        </div>

        {timers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card/30">
            <IconClock className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-6">Sin timers activos</p>
            <CreateTimerForm onCreateTimer={addTimer} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onToggle={() => toggleTimer(timer.id)}
                onReset={() => resetTimer(timer.id)}
                onDelete={() => removeTimer(timer.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
