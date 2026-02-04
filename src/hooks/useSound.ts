import { useCallback, useRef, useEffect } from "react";
import { useSoundSettings } from "@/context/sound-context";

export function useSound(src: string) {
  const { volume } = useSoundSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Crear el elemento de audio solo en el cliente
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(src);
      // Precargar el audio
      audioRef.current.load();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src]);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    if (audioRef.current) {
      // Actualizar volumen antes de reproducir
      audioRef.current.volume = volume;
      // Reiniciar si ya estaba sonando
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // El navegador puede bloquear autoplay sin interacción del usuario
        console.warn("Audio playback was prevented:", error);
      });
    }
  }, [volume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return { play, stop, pause };
}
