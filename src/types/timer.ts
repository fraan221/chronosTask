export interface Timer {
  id: string;
  name: string;
  duration: number; // duración total en segundos
  elapsed: number; // tiempo transcurrido en segundos
  isRunning: boolean;
  createdAt: string;
  lastStartedAt?: number; // timestamp cuando se inició la última vez
}

export interface DailyRecord {
  date: string; // formato YYYY-MM-DD
  totalSeconds: number;
  timers: Timer[];
}

export interface AppState {
  timers: Timer[];
  history: DailyRecord[];
  lastActiveDate: string;
}
