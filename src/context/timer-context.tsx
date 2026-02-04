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

  // Tick del timer
  useEffect(() => {
    const hasRunning = timers.some((t) => t.isRunning);

    if (hasRunning) {
      intervalRef.current = setInterval(() => {
        setTimers((prev) =>
          prev.map((t) => {
            if (t.isRunning) {
              const newElapsed = t.elapsed + 1;
              if (t.duration > 0 && newElapsed >= t.duration) {
                return { ...t, elapsed: t.duration, isRunning: false };
              }
              return { ...t, elapsed: newElapsed };
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
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t)),
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, elapsed: 0, isRunning: false } : t,
      ),
    );
  }, []);

  const stopAllTimers = useCallback(() => {
    setTimers((prev) => prev.map((t) => ({ ...t, isRunning: false })));
  }, []);

  const totalTodaySeconds = timers.reduce((acc, t) => acc + t.elapsed, 0);

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
