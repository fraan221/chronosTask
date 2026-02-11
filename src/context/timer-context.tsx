"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import type { Timer, DailyRecord, AppState } from "@/types/timer";

// --- Logic helper functions ---

const STORAGE_KEY = "chronos-task-data";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function generateId(): string {
  return `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadFromStorage(): AppState {
  if (typeof window === "undefined") {
    return { timers: [], history: [], lastActiveDate: getToday() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading from localStorage:", e);
  }

  return { timers: [], history: [], lastActiveDate: getToday() };
}

function saveToStorage(state: AppState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

// --- Context & Provider ---

interface TimerContextType {
  timers: Timer[];
  history: DailyRecord[];
  isLoaded: boolean;
  totalTodaySeconds: number;
  addTimer: (name: string, durationMinutes: number) => void;
  removeTimer: (id: string) => void;
  toggleTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  stopAllTimers: () => void;
  editTimer: (id: string, updates: { name?: string; duration?: number }) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string>(getToday());
  const [isLoaded, setIsLoaded] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar datos del localStorage al montar
  useEffect(() => {
    const state = loadFromStorage();
    setTimers(state.timers);
    setHistory(state.history);
    setLastActiveDate(state.lastActiveDate);
    setIsLoaded(true);
  }, []);

  // Verificar cambio de día y hacer reset
  useEffect(() => {
    if (!isLoaded) return;

    const today = getToday();

    if (lastActiveDate !== today) {
      const totalSeconds = timers.reduce((acc, t) => acc + t.elapsed, 0);

      if (totalSeconds > 0 || timers.length > 0) {
        const dailyRecord: DailyRecord = {
          date: lastActiveDate,
          totalSeconds,
          timers: timers.map((t) => ({ ...t, isRunning: false })),
        };

        setHistory((prev) => {
          const exists = prev.some((r) => r.date === lastActiveDate);
          if (exists) return prev;
          return [...prev, dailyRecord];
        });
      }

      setTimers((prev) =>
        prev.map((t) => ({ ...t, elapsed: 0, isRunning: false })),
      );
      setLastActiveDate(today);
    }
  }, [isLoaded, lastActiveDate, timers]);

  // Guardar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    saveToStorage({ timers, history, lastActiveDate });
  }, [timers, history, lastActiveDate, isLoaded]);

  // Tick del timer con timestamps precisos para evitar drift
  useEffect(() => {
    const hasRunning = timers.some((t) => t.isRunning);

    if (hasRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setTimers((prev) =>
          prev.map((t) => {
            if (t.isRunning && t.lastStartedAt) {
              // Calcular elapsed basado en timestamp real
              const runningTime = Math.floor((now - t.lastStartedAt) / 1000);
              const newElapsed = t.elapsed + runningTime;
              
              // Actualizar lastStartedAt para el próximo tick
              const updatedTimer = { ...t, lastStartedAt: now };
              
              if (t.duration > 0 && newElapsed >= t.duration) {
                return { ...updatedTimer, elapsed: t.duration, isRunning: false, lastStartedAt: undefined };
              }
              return { ...updatedTimer, elapsed: newElapsed };
            }
            return t;
          }),
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timers]);

  const addTimer = useCallback((name: string, durationMinutes: number) => {
    const newTimer: Timer = {
      id: generateId(),
      name: name.trim() || "Timer sin nombre",
      duration: durationMinutes * 60,
      elapsed: 0,
      isRunning: false,
      createdAt: new Date().toISOString(),
    };

    setTimers((prev) => [...prev, newTimer]);
  }, []);

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (t.isRunning) {
            // Pausar: calcular elapsed final y limpiar timestamp
            const now = Date.now();
            const runningTime = t.lastStartedAt ? Math.floor((now - t.lastStartedAt) / 1000) : 0;
            return { ...t, isRunning: false, elapsed: t.elapsed + runningTime, lastStartedAt: undefined };
          } else {
            // Iniciar: establecer timestamp de inicio
            return { ...t, isRunning: true, lastStartedAt: Date.now() };
          }
        }
        return t;
      }),
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, elapsed: 0, isRunning: false, lastStartedAt: undefined } : t,
      ),
    );
  }, []);

  const stopAllTimers = useCallback(() => {
    const now = Date.now();
    setTimers((prev) => 
      prev.map((t) => {
        if (t.isRunning && t.lastStartedAt) {
          const runningTime = Math.floor((now - t.lastStartedAt) / 1000);
          return { ...t, isRunning: false, elapsed: t.elapsed + runningTime, lastStartedAt: undefined };
        }
        return { ...t, isRunning: false, lastStartedAt: undefined };
      })
    );
  }, []);

  const editTimer = useCallback((id: string, updates: { name?: string; duration?: number }) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.isRunning) {
          const updatedTimer = { ...t };
          if (updates.name !== undefined) {
            updatedTimer.name = updates.name.trim() || "Timer sin nombre";
          }
          if (updates.duration !== undefined) {
            updatedTimer.duration = updates.duration;
          }
          return updatedTimer;
        }
        return t;
      }),
    );
  }, []);

  // Calcular tiempo total incluyendo timers en ejecución
  const totalTodaySeconds = timers.reduce((acc, t) => {
    let elapsed = t.elapsed;
    if (t.isRunning && t.lastStartedAt) {
      const runningTime = Math.floor((Date.now() - t.lastStartedAt) / 1000);
      elapsed += runningTime;
    }
    return acc + elapsed;
  }, 0);

  return (
    <TimerContext.Provider
      value={{
        timers,
        history,
        isLoaded,
        totalTodaySeconds,
        addTimer,
        removeTimer,
        toggleTimer,
        resetTimer,
        stopAllTimers,
        editTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}
