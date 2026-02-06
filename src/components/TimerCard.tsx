"use client";

import { useState, memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Kbd } from "@/components/ui/kbd";
import type { Timer } from "@/types/timer";
import { formatTime } from "@/lib/time";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSound } from "@/hooks/useSound";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStopFilled,
  IconRefresh,
  IconTrash,
  IconClock,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";

interface FocusOverlayProps {
  name: string;
  displayTime: string;
  duration: number;
  elapsed: number;
  isRunning: boolean;
  isCompleted: boolean;
  isAlarmPlaying: boolean;
  progress: number;
  onClose: () => void;
  onToggle: () => void;
  onReset: () => void;
  onStopAlarm: () => void;
  onStopAlarmAndReset: () => void;
}

const FocusOverlay = memo(function FocusOverlay({
  name,
  displayTime,
  duration,
  elapsed,
  isRunning,
  isCompleted,
  isAlarmPlaying,
  progress,
  onClose,
  onToggle,
  onReset,
  onStopAlarm,
  onStopAlarmAndReset,
}: FocusOverlayProps) {
  if (typeof window === "undefined") return null;

  // Keyboard shortcuts para Zen Mode
  // Si la alarma está sonando, Space detiene y resetea
  useKeyboardShortcuts({
    onSpace: isAlarmPlaying ? onStopAlarmAndReset : onToggle,
    onEscape: onClose,
    onBackspace: isAlarmPlaying ? onStopAlarmAndReset : onReset,
  });

  // Ocultar scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 group cursor-default">
      {/* Botón Cerrar - Solo visible al hover en la esquina */}
      <div className="absolute top-8 right-8 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 text-muted-foreground/50 hover:text-foreground hover:bg-secondary/20 rounded-full"
          onClick={onClose}
        >
          <IconMinimize className="h-6 w-6" stroke={1.5} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        {/* Nombre del Timer - Muy sutil */}
        <h2 className="text-xl font-medium text-muted-foreground/10 group-hover:text-muted-foreground/50 transition-colors duration-700 absolute top-[15%]">
          {name}
        </h2>

        {/* Timer - EL PROTAGONISTA ABSOLUTO */}
        <div
          className={`font-mono font-bold tracking-tight tabular-nums leading-none select-none transition-all duration-300
            ${isRunning ? "text-primary/90" : "text-primary/20"}
            ${isCompleted ? "text-primary opacity-50" : ""}
             text-[25vw] md:text-[25vh]
          `}
        >
          {displayTime}
        </div>

        {/* Controles - Invisibles hasta que el usuario interactúa */}
        <div className="absolute bottom-[15%] flex items-center gap-8 opacity-30 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
          {isAlarmPlaying ? (
            <Button
              onClick={onStopAlarm}
              variant="ghost"
              className="h-24 w-24 rounded-full hover:bg-primary/5 text-primary transition-all duration-300 hover:scale-110 p-0"
            >
              <IconPlayerStopFilled
                className="h-12 w-12 fill-current"
                stroke={0}
              />
            </Button>
          ) : (
            <Button
              onClick={onToggle}
              disabled={isCompleted && !isAlarmPlaying}
              variant="ghost"
              className="h-24 w-24 rounded-full hover:bg-primary/5 text-primary transition-all duration-300 hover:scale-110 p-0"
            >
              {isRunning ? (
                <IconPlayerPause
                  className="h-12 w-12 fill-current opacity-80"
                  stroke={0}
                />
              ) : (
                <IconPlayerPlay
                  className="h-12 w-12 fill-current opacity-80 pl-1"
                  stroke={0}
                />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            disabled={elapsed === 0}
            className="h-16 w-16 rounded-full text-muted-foreground/30 hover:text-foreground hover:bg-muted/10 transition-all duration-300"
          >
            <IconRefresh className="h-7 w-7" stroke={1.5} />
          </Button>
        </div>
      </div>

      {/* Barra de progreso minimalista al borde inferior */}
      {duration > 0 && (
        <div className="w-full absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Progress
            value={progress}
            className={`h-1 bg-transparent rounded-none ${isCompleted ? "[&>div]:bg-primary" : "[&>div]:bg-primary/30"}`}
          />
        </div>
      )}

      {/* Keyboard shortcuts info */}
      <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60 border border-foreground/5">
              SPACE
            </span>
            <span>{isRunning ? "Pausar" : "Iniciar"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60 border border-foreground/5">
              ESC
            </span>
            <span>Salir</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60 border border-foreground/5">
              ⌫
            </span>
            <span>Reset</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
});

interface TimerCardProps {
  timer: Timer;
  onToggle: () => void;
  onReset: () => void;
  onDelete: () => void;
}

export function TimerCard({
  timer,
  onToggle,
  onReset,
  onDelete,
}: TimerCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const { name, duration, elapsed, isRunning } = timer;

  // Alarma de sonido (usa volumen global del SoundContext)
  const { play: playAlarm, stop: stopAlarm } = useSound("/iphone_alarm.mp3");

  // Ref para trackear si la alarma ya sonó en este ciclo de completado
  const alarmTriggeredForThisCycleRef = useRef(false);

  // Calcular progreso
  const progress = duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0;
  const isCompleted = duration > 0 && elapsed >= duration;

  // Detectar cuando el timer se completa y reproducir alarma
  useEffect(() => {
    if (isCompleted && duration > 0 && !alarmTriggeredForThisCycleRef.current) {
      playAlarm();
      setIsAlarmPlaying(true);
      alarmTriggeredForThisCycleRef.current = true;
    }
    // Resetear el ref cuando el timer se reinicia (ya no está completado)
    if (!isCompleted) {
      alarmTriggeredForThisCycleRef.current = false;
      setIsAlarmPlaying(false);
    }
  }, [isCompleted, duration, playAlarm]);

  // Función para detener la alarma manualmente
  const handleStopAlarm = () => {
    stopAlarm();
    setIsAlarmPlaying(false);
  };

  // Detener alarma al desmontar
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, [stopAlarm]);

  // Tiempo format
  const displayTime =
    duration > 0
      ? formatTime(Math.max(duration - elapsed, 0))
      : formatTime(elapsed);

  // Detectar modo Zen desde URL
  useEffect(() => {
    const zenMode = searchParams.get("zen");
    const zenTimerId = searchParams.get("timer");

    if (zenMode === "true" && zenTimerId === timer.id) {
      setIsFullScreen(true);
    }
  }, [searchParams, timer.id]);

  // Funciones para manejar el modo Zen
  const enterZenMode = () => {
    setIsFullScreen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("zen", "true");
    params.set("timer", timer.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const exitZenMode = () => {
    setIsFullScreen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("zen");
    params.delete("timer");
    const newQuery = params.toString();
    router.push(newQuery ? `?${newQuery}` : "/", { scroll: false });
  };

  // Función para detener alarma y resetear timer
  const handleStopAlarmAndReset = () => {
    stopAlarm();
    setIsAlarmPlaying(false);
    onReset();
  };

  // Keyboard shortcuts cuando el timer está activo (fuera de Zen Mode)
  // Space funciona cuando el mouse está sobre el card O cuando el timer tiene elapsed > 0
  // Si la alarma está sonando, Space detiene y resetea
  useKeyboardShortcuts({
    onSpace: !isFullScreen
      ? isAlarmPlaying
        ? handleStopAlarmAndReset
        : isHovered || elapsed > 0
          ? onToggle
          : undefined
      : undefined,
    onBackspace:
      !isFullScreen && (isHovered || elapsed > 0) && elapsed > 0
        ? isAlarmPlaying
          ? handleStopAlarmAndReset
          : onReset
        : undefined,
    // Esc no hace nada fuera de Zen Mode
  });

  return (
    <>
      {isFullScreen && (
        <FocusOverlay
          name={name}
          displayTime={displayTime}
          duration={duration}
          elapsed={elapsed}
          isRunning={isRunning}
          isCompleted={isCompleted}
          isAlarmPlaying={isAlarmPlaying}
          progress={progress}
          onClose={exitZenMode}
          onToggle={onToggle}
          onReset={onReset}
          onStopAlarm={handleStopAlarm}
          onStopAlarmAndReset={handleStopAlarmAndReset}
        />
      )}
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
        transition-all duration-300 border-border/40 hover:border-primary/20
        ${isRunning ? "ring-1 ring-primary/20 shadow-lg shadow-primary/5 bg-white/80 dark:bg-zinc-900/80" : "bg-white/40 dark:bg-zinc-900/30 hover:bg-white/60 dark:hover:bg-zinc-900/60 shadow-sm hover:shadow-md"}
        ${isCompleted ? "bg-primary/5 border-primary/20" : ""}
        backdrop-blur-sm group relative overflow-hidden
      `}
      >
        <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold truncate pr-2 text-muted-foreground group-hover:text-foreground transition-colors">
            {name}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={enterZenMode}
              title="Modo Zen (Pantalla completa)"
            >
              <IconMaximize className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={onDelete}
            >
              <IconTrash className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          {/* Display del tiempo */}
          <div className="text-center py-2">
            <div
              className={`
              text-6xl font-mono font-bold tracking-tighter tabular-nums
              ${isRunning ? "text-primary scale-105" : "text-foreground/80"}
              ${isCompleted ? "text-primary opacity-50" : ""}
              transition-all duration-300
            `}
            >
              {displayTime}
            </div>
          </div>

          {/* Barra de progreso (solo si hay duración) */}
          {duration > 0 && (
            <div className="relative pt-1 px-2">
              <Progress
                value={progress}
                className={`h-1 bg-muted ${isCompleted ? "[&>div]:bg-primary" : "[&>div]:bg-primary"}`}
              />
            </div>
          )}

          {/* Controles */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                disabled={elapsed === 0}
                title="Reiniciar"
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
                <IconRefresh className="h-4 w-4" />
            </Button>

            {isAlarmPlaying ? (
              <Button
                onClick={handleStopAlarm}
                className="h-14 w-14 rounded-full shadow-md shadow-primary/20 hover:scale-105 transition-all bg-destructive text-destructive-foreground hover:bg-destructive/90"
                size="icon"
              >
                <IconPlayerStopFilled className="h-6 w-6 fill-current animate-pulse" />
              </Button>
            ) : (
              <Button
                onClick={onToggle}
                disabled={isCompleted && !isAlarmPlaying}
                className={`
                    h-14 w-14 rounded-full shadow-md hover:scale-105 transition-all
                    ${isRunning 
                        ? "bg-white dark:bg-zinc-800 text-primary border border-primary/20 shadow-primary/10 hover:border-primary/40" 
                        : "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30"}
                `}
                size="icon"
              >
                {isRunning ? (
                  <IconPlayerPause className="h-6 w-6 fill-current" />
                ) : (
                  <IconPlayerPlay className="h-6 w-6 fill-current pl-1" />
                )}
              </Button>
            )}
            
            <div className="w-10" /> {/* Spacer to balance layout */}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
