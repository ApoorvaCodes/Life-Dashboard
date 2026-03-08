import { createContext, useContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import SparkleBackground from "@/components/SparkleBackground";

export type Habit = {
  id: string;
  name: string;
  completed: boolean;
};

export type SleepData = {
  date: string; // YYYY-MM-DD
  hours: number;
};

export type GymPlan = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type LoggedFood = {
  id: string;
  name: string;
  calories: number;
};

export type CaloriesState = {
  height: number;
  weight: number;
  logs: LoggedFood[];
};

export type FinancesState = {
  budget: number;
  expenses: number;
};

type AppContextType = {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  sleepLogs: SleepData[];
  setSleepLogs: (logs: SleepData[]) => void;
  gymPlan: GymPlan;
  setGymPlan: (plan: GymPlan) => void;
  finances: FinancesState;
  setFinances: (f: FinancesState) => void;
  calories: CaloriesState;
  setCalories: (c: CaloriesState) => void;
  focusSessions: number;
  setFocusSessions: (s: number) => void;
  dailyProgress: number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function isoToday() {
  return new Date().toISOString().split("T")[0];
}

function weekdayKey(d = new Date()) {
  return d
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof GymPlan;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const today = isoToday();

  const [lastResetDate, setLastResetDate] = useLocalStorage<string>(
    "lastResetDate",
    today,
  );

  const [habits, setHabits] = useLocalStorage<Habit[]>("dashboard_habits", [
    { id: "1", name: "Drink 2L Water", completed: false },
    { id: "2", name: "Read 10 pages", completed: false },
  ]);

  const [sleepLogs, setSleepLogs] = useLocalStorage<SleepData[]>(
    "dashboard_sleep",
    [],
  );

  const [gymPlan, setGymPlan] = useLocalStorage<GymPlan>("dashboard_gym", {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [finances, setFinances] = useLocalStorage<FinancesState>(
    "dashboard_finances",
    { budget: 3000, expenses: 1500 },
  );

  const [calories, setCalories] = useLocalStorage<CaloriesState>(
    "dashboard_calories",
    { height: 175, weight: 70, logs: [] },
  );

  const [focusSessions, setFocusSessions] = useLocalStorage<number>(
    "dashboard_focus",
    0,
  );

  useEffect(() => {
    if (lastResetDate !== today) {
      setHabits(habits.map((h) => ({ ...h, completed: false })));

      const currentDay = weekdayKey();
      setGymPlan({ ...gymPlan, [currentDay]: false });

      setCalories({ ...calories, logs: [] });
      setFocusSessions(0);
      setLastResetDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, lastResetDate]);

  let progress = 0;

  const currentDay = weekdayKey();
  if (gymPlan[currentDay]) progress += 20;

  habits.forEach((h) => {
    if (h.completed) progress += 5;
  });

  progress += focusSessions * 10;

  const sleepLoggedToday = sleepLogs.some((log) => log.date === today);
  if (sleepLoggedToday) progress += 5;

  progress = Math.min(progress, 100);

  return (
    <AppContext.Provider
      value={{
        habits,
        setHabits,
        sleepLogs,
        setSleepLogs,
        gymPlan,
        setGymPlan,
        finances,
        setFinances,
        calories,
        setCalories,
        focusSessions,
        setFocusSessions,
        dailyProgress: progress,
      }}
    >
      <div className="relative min-h-screen">
        <SparkleBackground />
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}