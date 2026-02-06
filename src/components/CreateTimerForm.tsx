"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";

interface CreateTimerFormProps {
  onCreateTimer: (name: string, durationMinutes: number) => void;
}

export function CreateTimerForm({ onCreateTimer }: CreateTimerFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const durationMinutes = parseInt(duration) || 0;
    onCreateTimer(name, durationMinutes);

    setName("");
    setDuration("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 shadow-sm rounded-full px-4 font-medium">
          <IconPlus className="h-4 w-4" stroke={2.5} />
          Nuevo Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <IconPlus className="h-4 w-4" stroke={2.5} />
            </div>
            Nuevo Timer
          </DialogTitle>
          <DialogDescription>Configura tu sesión de enfoque.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Proyecto Web"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Minutos
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="0 = Ilimitado"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="0"
              className="bg-background"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 font-semibold shadow-sm">
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
