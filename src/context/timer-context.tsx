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
  const [accumulatedTodaySeconds, setAccumulatedTodaySeconds] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timersRef = useRef(timers);
  timersRef.current = timers;

  // Cargar datos del localStorage al montar
  useEffect(() => {
    const state = loadFromStorage();
    setTimers(state.timers);
    setHistory(state.history);
    setLastActiveDate(state.lastActiveDate);
    setAccumulatedTodaySeconds(state.accumulatedTodaySeconds ?? 0);
    setIsLoaded(true);
  }, []);

  // Verificar cambio de día y hacer reset
  useEffect(() => {
    if (!isLoaded) return;

    const today = getToday();

    if (lastActiveDate !== today) {
      const currentTimers = timersRef.current;
      const totalSeconds = accumulatedTodaySeconds + currentTimers.reduce((acc, t) => acc + t.elapsed, 0);

      if (totalSeconds > 0 || currentTimers.length > 0) {
        const dailyRecord: DailyRecord = {
          date: lastActiveDate,
          totalSeconds,
          timers: currentTimers.map((t) => ({ ...t, isRunning: false })),
        };

        setHistory((prev) => {
          const exists = prev.some((r) => r.date === lastActiveDate);
          if (exists) return prev;
          return [...prev, dailyRecord];
        });
      }

      setTimers((prev) =>
        prev.map((t) => ({ ...t, elapsed: 0, isRunning: false, lastStartedAt: undefined })),
      );
      setAccumulatedTodaySeconds(0);
      setLastActiveDate(today);
    }
  }, [isLoaded, lastActiveDate, accumulatedTodaySeconds]);

  // Guardar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    saveToStorage({ timers, history, lastActiveDate, accumulatedTodaySeconds });
  }, [timers, history, lastActiveDate, accumulatedTodaySeconds, isLoaded]);

  // Tick para forzar re-render sin recrear el intervalo
  const [, setTick] = useState(0);

  // Número de timers corriendo -- valor estable (número) para la dependencia del effect
  const runningCount = timers.filter((t) => t.isRunning).length;

  // Tick del timer -- intervalo estable que solo se recrea cuando cambia runningCount
  useEffect(() => {
    if (runningCount === 0) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const current = timersRef.current;
      let hasCompleted = false;

      for (const t of current) {
        if (t.isRunning && t.lastStartedAt && t.duration > 0) {
          const totalElapsed = t.elapsed + Math.floor((now - t.lastStartedAt) / 1000);
          if (totalElapsed >= t.duration) {
            hasCompleted = true;
            break;
          }
        }
      }

      if (hasCompleted) {
        // Solo mutar estado de timers cuando uno se completa
        setTimers((prev) =>
          prev.map((t) => {
            if (t.isRunning && t.lastStartedAt && t.duration > 0) {
              const totalElapsed = t.elapsed + Math.floor((Date.now() - t.lastStartedAt) / 1000);
              if (totalElapsed >= t.duration) {
                return { ...t, elapsed: t.duration, isRunning: false, lastStartedAt: undefined };
              }
            }
            return t;
          }),
        );
      } else {
        // Forzar re-render para que la UI actualice los contadores
        setTick((c) => c + 1);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [runningCount]);

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
    // Read timer state OUTSIDE setTimers to avoid double-invocation in Strict Mode
    const timer = timers.find((t) => t.id === id);
    if (timer) {
      let finalElapsed = timer.elapsed;
      if (timer.isRunning && timer.lastStartedAt) {
        finalElapsed += Math.floor((Date.now() - timer.lastStartedAt) / 1000);
      }
      if (finalElapsed > 0) {
        setAccumulatedTodaySeconds((acc) => acc + finalElapsed);
      }
    }
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, [timers]);

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
    // Read timer state OUTSIDE setTimers to avoid double-invocation in Strict Mode
    const timer = timers.find((t) => t.id === id);
    if (timer) {
      let finalElapsed = timer.elapsed;
      if (timer.isRunning && timer.lastStartedAt) {
        finalElapsed += Math.floor((Date.now() - timer.lastStartedAt) / 1000);
      }
      if (finalElapsed > 0) {
        setAccumulatedTodaySeconds((prev) => prev + finalElapsed);
      }
    }
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, elapsed: 0, isRunning: false, lastStartedAt: undefined } : t,
      ),
    );
  }, [timers]);

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

  // Calcular tiempo total: acumulado (de resets/removes) + elapsed actual de cada timer
  const currentTimersSeconds = timers.reduce((acc, t) => {
    let elapsed = t.elapsed;
    if (t.isRunning && t.lastStartedAt) {
      elapsed += Math.floor((Date.now() - t.lastStartedAt) / 1000);
    }
    return acc + elapsed;
  }, 0);

  const totalTodaySeconds = accumulatedTodaySeconds + currentTimersSeconds;

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
