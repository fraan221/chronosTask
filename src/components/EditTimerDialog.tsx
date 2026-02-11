"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Timer } from "@/types/timer";

interface EditTimerDialogProps {
  timer: Timer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: { name?: string; duration?: number }) => void;
}

export function EditTimerDialog({
  timer,
  open,
  onOpenChange,
  onSave,
}: EditTimerDialogProps) {
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  useEffect(() => {
    if (timer) {
      setName(timer.name);
      setDurationMinutes(
        timer.duration > 0 ? String(timer.duration / 60) : ""
      );
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timer) return;

    const updates: { name?: string; duration?: number } = {};

    if (name.trim()) {
      updates.name = name.trim();
    }

    const minutes = parseInt(durationMinutes);
    if (!isNaN(minutes) && minutes >= 0) {
      updates.duration = minutes * 60;
    }

    onSave(timer.id, updates);
    onOpenChange(false);
  };

  if (!timer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Timer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre</Label>
            <Input
              id="edit-name"
              placeholder="Nombre del timer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-duration">Duración (minutos)</Label>
            <Input
              id="edit-duration"
              type="number"
              min="0"
              placeholder="0 = sin límite"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Deja en 0 o vacío para temporizador sin límite
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
