"use client";

import { useState } from "react";
import { useTimers } from "@/hooks/useTimers";
import { TimerCard } from "@/components/TimerCard";
import { CreateTimerForm } from "@/components/CreateTimerForm";
import { DailySummary } from "@/components/DailySummary";
import { EditTimerDialog } from "@/components/EditTimerDialog";
import type { Timer } from "@/types/timer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconClock, IconLoader2 } from "@tabler/icons-react";

export default function Home() {
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    timers,
    isLoaded,
    totalTodaySeconds,
    addTimer,
    removeTimer,
    toggleTimer,
    resetTimer,
    editTimer,
  } = useTimers();

  const handleEditTimer = (timer: Timer) => {
    setEditingTimer(timer);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (id: string, updates: { name?: string; duration?: number }) => {
    editTimer(id, updates);
  };

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
    <>
      <EditTimerDialog
        timer={editingTimer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <div className="container mx-auto px-4 pb-12 space-y-12 max-w-5xl">
        {/* Resumen del día */}
        <DailySummary
          totalSeconds={totalTodaySeconds}
          activeTimers={0}
        />

      {/* Sección de Timers */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground/80 tracking-tight">
            <IconClock className="h-5 w-5 text-primary" stroke={2} />
            Mis Timers
          </h2>
          <CreateTimerForm onCreateTimer={addTimer} />
        </div>

        {timers.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border/60 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm">
            <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconClock className="h-10 w-10 text-primary/40" stroke={1.5} />
            </div>
            <p className="text-lg font-medium mb-2 text-foreground/80">Sin timers activos</p>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">Crea tu primer timer para comenzar a registrar tu productividad.</p>
            <CreateTimerForm onCreateTimer={addTimer} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {timers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onToggle={() => toggleTimer(timer.id)}
                onReset={() => resetTimer(timer.id)}
                onDelete={() => removeTimer(timer.id)}
                onEdit={() => handleEditTimer(timer)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
