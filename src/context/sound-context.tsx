"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface SoundContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY = "chronos-task-sound";
const VOLUME_STEP = 0.1;

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar configuración del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { volume: storedVolume, isMuted: storedMuted } =
            JSON.parse(stored);
          setVolumeState(storedVolume ?? 0.7);
          setIsMuted(storedMuted ?? false);
        }
      } catch (e) {
        console.error("Error loading sound settings:", e);
      }
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, isMuted }));
    } catch (e) {
      console.error("Error saving sound settings:", e);
    }
  }, [volume, isMuted, isLoaded]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
    if (newVolume > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const increaseVolume = useCallback(() => {
    setVolumeState((prev) => {
      // Redondear a 1 decimal para evitar problemas de precisión de punto flotante
      const newVol = Math.min(1, Math.round((prev + VOLUME_STEP) * 10) / 10);
      if (newVol > 0) setIsMuted(false);
      return newVol;
    });
  }, []);

  const decreaseVolume = useCallback(() => {
    setVolumeState((prev) => {
      // Redondear a 1 decimal para evitar problemas de precisión de punto flotante
      return Math.max(0, Math.round((prev - VOLUME_STEP) * 10) / 10);
    });
  }, []);

  return (
    <SoundContext.Provider
      value={{
        volume: isMuted ? 0 : volume,
        isMuted,
        setVolume,
        toggleMute,
        increaseVolume,
        decreaseVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundSettings must be used within a SoundProvider");
  }
  return context;
}
