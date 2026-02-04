"use client";

import { useTimers } from "@/hooks/useTimers";
import { HistoryPanel } from "@/components/HistoryPanel";
import { IconLoader2 } from "@tabler/icons-react";

export default function HistoryPage() {
  const { history, isLoaded } = useTimers();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <IconLoader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Historial</h1>
        <p className="text-muted-foreground">
          Revisa tu progreso día a día y mantén la constancia.
        </p>
      </div>
      
      <HistoryPanel history={history} />
    </div>
  );
}
