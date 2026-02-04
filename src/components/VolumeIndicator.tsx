"use client";

import { useEffect, useState } from "react";
import { IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";
import { useSoundSettings } from "@/context/sound-context";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

export function VolumeIndicator() {
  const { volume, isMuted, increaseVolume, decreaseVolume, toggleMute } =
    useSoundSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Keyboard shortcuts para volumen (global)
  useKeyboardShortcuts({
    onCtrlArrowUp: () => {
      increaseVolume();
      showIndicator();
    },
    onCtrlArrowDown: () => {
      decreaseVolume();
      showIndicator();
    },
    onEnd: () => {
      toggleMute();
      showIndicator();
    },
  });

  const showIndicator = () => {
    setIsVisible(true);
    if (hideTimeout) clearTimeout(hideTimeout);
    const timeout = setTimeout(() => setIsVisible(false), 1500);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);

  // Calcular el porcentaje de volumen para mostrar
  const volumePercent = Math.round(volume * 100);

  // Elegir el ícono según el nivel de volumen
  // Solo 3 íconos para mejor distinción visual
  const VolumeIcon =
    isMuted || volume === 0
      ? IconVolumeOff
      : volume <= 0.5
        ? IconVolume2
        : IconVolume;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-100 transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none",
      )}
    >
      <div className="bg-background/80 backdrop-blur-xl border border-border/40 rounded-full shadow-2xl px-5 py-3 flex items-center gap-3">
        <VolumeIcon
          className={cn(
            "h-4 w-4",
            isMuted || volume === 0
              ? "text-muted-foreground"
              : "text-foreground",
          )}
          stroke={1.5}
        />

        {/* Barra de volumen */}
        <div className="w-24 h-1 bg-muted/50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              isMuted ? "bg-muted-foreground/30" : "bg-foreground",
            )}
            style={{ width: `${isMuted ? 0 : volumePercent}%` }}
          />
        </div>

        <span
          className={cn(
            "text-xs font-medium font-mono w-8 text-right tabular-nums",
            isMuted ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {isMuted ? "sil" : volumePercent}
        </span>
      </div>
    </div>
  );
}
