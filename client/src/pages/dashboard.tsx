import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  AlertTriangle,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Flame,
  Focus,
  PiggyBank,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

function isoToday() {
  return new Date().toISOString().split("T")[0];
}

function weekdayKey(d = new Date()) {
  return d
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
}

const foodCupsToCalories: Record<string, number> = {
  "rice (1 cup)": 200,
  "oats (1 cup)": 300,
  "milk (1 cup)": 120,
  "chicken (1 cup)": 250,
  "beans (1 cup)": 240,
  "broccoli (1 cup)": 55,
  "peanut butter (1 cup)": 1500,
};

function GlassCard({ className, ...props }: React.ComponentProps<typeof Card> & { className?: string }) {
  return (
    <Card
      className={cn(
        "glass-card rounded-2xl border-black/5 bg-white/40",
        "transition will-change-transform hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

export default function DashboardPage() {
  const {
    habits,
    setHabits,
    sleepLogs,
    setSleepLogs,
    gymPlan,
    finances,
    setFinances,
    calories,
    setCalories,
    focusSessions,
    dailyProgress,
  } = useAppContext();

  const { toast } = useToast();

  const today = isoToday();
  const currentDay = weekdayKey() as keyof typeof gymPlan;

  const [sleepInput, setSleepInput] = useState("7.5");
  const [budgetInput, setBudgetInput] = useState(String(finances.budget));
  const [expensesInput, setExpensesInput] = useState(String(finances.expenses));

  const [heightInput, setHeightInput] = useState(String(calories.height));
  const [weightInput, setWeightInput] = useState(String(calories.weight));

  const [foodName, setFoodName] = useState(Object.keys(foodCupsToCalories)[0] ?? "rice (1 cup)");

  const [habitDraft, setHabitDraft] = useState("");

  const gymWeeklyCount = Object.values(gymPlan).filter(Boolean).length;
  const gymWeeklyPct = Math.round((gymWeeklyCount / 7) * 100);

  const sleepWeekData = useMemo(() => {
    const map = new Map(sleepLogs.map((l) => [l.date, l.hours]));
    const d = new Date();
    const data = [] as { day: string; hours: number }[];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(d);
      dt.setDate(d.getDate() - i);
      const iso = dt.toISOString().split("T")[0];
      const label = dt.toLocaleDateString("en-US", { weekday: "short" });
      data.push({ day: label, hours: map.get(iso) ?? 0 });
    }
    return data;
  }, [sleepLogs]);

  const sleepLoggedToday = sleepLogs.some((l) => l.date === today);

  const remaining = finances.budget - finances.expenses;

  const maintenanceCalories = useMemo(() => {
    const h = Number(heightInput) || 0;
    const w = Number(weightInput) || 0;
    return Math.round(24 * w + 5 * h);
  }, [heightInput, weightInput]);

  const consumed = calories.logs.reduce((acc, l) => acc + l.calories, 0);

  const habitsCompleted = habits.filter((h) => h.completed).length;

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 data-testid="text-title" className="text-3xl sm:text-4xl font-semibold text-[#111111]">
              Build better days
            </h1>
            <p className="text-muted-foreground max-w-xl">
              A calm control center for your daily systems — sleep, training, focus, fuel, money, and habits.
            </p>
          </motion.div>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Daily progress</div>
                <div className="text-2xl font-semibold" data-testid="text-daily-progress">
                  {dailyProgress}%
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right leading-relaxed">
                <div>Gym +20%</div>
                <div>Habit +5%</div>
                <div>Focus +10%</div>
                <div>Sleep +5%</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={dailyProgress} data-testid="progress-daily" className="bg-black/5" />
            </div>
          </GlassCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {/* Sleep - BLUE */}
          <GlassCard className="lg:col-span-2 border-l-4 border-l-blue-500">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 grid place-items-center">
                  <BedDouble className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-600">Sleep Tracker</CardTitle>
                  <div className="text-sm text-muted-foreground">Last 7 days</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  data-testid="input-sleep-hours"
                  className="w-24 bg-white/50 border-black/10"
                  value={sleepInput}
                  onChange={(e) => setSleepInput(e.target.value)}
                  inputMode="decimal"
                />
                <Button
                  data-testid="button-log-sleep"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    const hours = Math.max(0, Math.min(24, Number(sleepInput) || 0));
                    const next = sleepLogs.filter((l) => l.date !== today).concat({ date: today, hours });
                    setSleepLogs(next);
                    toast({ title: "Sleep logged", description: `${hours} hours for today.` });
                  }}
                  disabled={sleepLoggedToday}
                >
                  {sleepLoggedToday ? "Logged" : "Log"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-44 w-full" data-testid="chart-sleep">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepWeekData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} stroke="#888" fontSize={12} />
                    <Tooltip
                      cursor={{ stroke: "#ddd", strokeWidth: 1 }}
                      contentStyle={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: 12,
                        backdropFilter: "blur(4px)",
                      }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="url(#sleepFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </GlassCard>

          {/* Gym - RED */}
          <GlassCard className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-red-50 grid place-items-center">
                  <Dumbbell className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-red-600">Gym Tracker</CardTitle>
                  <div className="text-sm text-muted-foreground">Weekly completion</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">Completed</div>
                  <div data-testid="text-gym-weekly">{gymWeeklyCount}/7</div>
                </div>
                <Progress value={gymWeeklyPct} data-testid="progress-gym-weekly" className="bg-red-100" />
                <div className="text-xs text-muted-foreground">Today: {currentDay}</div>
              </div>
              <Link
                href="/gym"
                data-testid="link-gym"
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 hover:bg-red-100 transition w-full"
              >
                <span className="text-sm font-medium text-red-700">Open Gym Plan</span>
                <span className="text-sm text-red-400">→</span>
              </Link>
            </CardContent>
          </GlassCard>

          {/* Finances - GREEN */}
          <GlassCard className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-green-50 grid place-items-center">
                  <PiggyBank className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-600">Financial Tracker</CardTitle>
                  <div className="text-sm text-muted-foreground">Budget vs expenses</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Budget</div>
                  <Input
                    data-testid="input-budget"
                    className="bg-white/50 border-black/10"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Expenses</div>
                  <Input
                    data-testid="input-expenses"
                    className="bg-white/50 border-black/10"
                    value={expensesInput}
                    onChange={(e) => setExpensesInput(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <Button
                data-testid="button-save-finances"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  const budget = Number(budgetInput) || 0;
                  const expenses = Number(expensesInput) || 0;
                  setFinances({ budget, expenses });
                  toast({ title: "Saved", description: "Finances updated." });
                }}
              >
                Save
              </Button>
              <div
                className={cn(
                  "rounded-xl border border-black/5 bg-white/50 px-4 py-3",
                  remaining < 0 && "border-red-200 bg-red-50",
                )}
                data-testid="card-finance-remaining"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Remaining</div>
                  <div className={cn("text-sm font-semibold", remaining < 0 && "text-red-600")}>{remaining}</div>
                </div>
                {remaining < 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                    <AlertTriangle className="h-4 w-4" /> Over budget.
                  </div>
                )}
              </div>
            </CardContent>
          </GlassCard>

          {/* Calories - ORANGE */}
          <GlassCard className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-50 grid place-items-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-orange-600">Calorie Tracker</CardTitle>
                  <div className="text-sm text-muted-foreground">Daily Fuel</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Height (cm)</div>
                  <Input
                    data-testid="input-height"
                    className="bg-white/50 border-black/10"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Weight (kg)</div>
                  <Input
                    data-testid="input-weight"
                    className="bg-white/50 border-black/10"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                  />
                </div>
              </div>
              <Button
                data-testid="button-add-food"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  const cals = foodCupsToCalories[foodName] ?? 0;
                  const next = { id: crypto.randomUUID(), name: foodName, calories: cals };
                  setCalories({ ...calories, logs: [...calories.logs, next] });
                }}
              >
                Add {foodName}
              </Button>
              <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-orange-800">Consumed</div>
                  <div className="text-sm font-bold text-orange-900" data-testid="text-consumed">{consumed}</div>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Focus - PURPLE */}
          <GlassCard className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-purple-50 grid place-items-center">
                  <Focus className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-purple-600">Cognitive Focus</CardTitle>
                  <div className="text-sm text-muted-foreground">Flow state sessions</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-800">
                Sessions completed: {focusSessions}
              </div>
              <Link
                href="/focus"
                data-testid="link-focus"
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-purple-600 px-4 py-3 hover:bg-purple-700 transition w-full text-white"
              >
                <span className="text-sm font-medium">Enter Focus Mode</span>
                <span className="text-sm opacity-70">→</span>
              </Link>
            </CardContent>
          </GlassCard>

          {/* Habits - YELLOW */}
          <GlassCard className="lg:col-span-2 border-l-4 border-l-yellow-500">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-yellow-50 grid place-items-center">
                  <ClipboardList className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-yellow-700">Habit Checklist</CardTitle>
                  <div className="text-sm text-muted-foreground">{habitsCompleted}/{habits.length} complete</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  data-testid="input-habit"
                  placeholder="New habit…"
                  value={habitDraft}
                  onChange={(e) => setHabitDraft(e.target.value)}
                  className="w-48 bg-white/50 border-black/10"
                />
                <Button
                  data-testid="button-add-habit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => {
                    const name = habitDraft.trim();
                    if (!name) return;
                    setHabits([{ id: crypto.randomUUID(), name, completed: false }, ...habits]);
                    setHabitDraft("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-2">
              {habits.map((h) => (
                <div
                  key={h.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-4 py-2 border transition",
                    h.completed ? "bg-yellow-50 border-yellow-200" : "bg-white/50 border-black/5",
                  )}
                >
                  <button
                    className="flex items-center gap-3 flex-1 text-left"
                    onClick={() => setHabits(habits.map((x) => (x.id === h.id ? { ...x, completed: !x.completed } : x)))}
                  >
                    <div className={cn("size-5 rounded border-2 grid place-items-center transition", h.completed ? "bg-yellow-500 border-yellow-500" : "border-black/10")}>
                      {h.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn("text-sm", h.completed && "line-through text-muted-foreground")}>{h.name}</span>
                  </button>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 text-black/20 hover:text-red-500"
                    onClick={() => setHabits(habits.filter((x) => x.id !== h.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </GlassCard>

         {/* Progress Rules */}
<GlassCard className="bg-white/40 text-black border-none shadow-xl">
  <CardHeader>
    <CardTitle className="text-lg">Progress Rules</CardTitle>
  </CardHeader>

  <CardContent className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span>Gym day</span>
      <span className="font-bold">+20%</span>
    </div>

    <div className="flex justify-between">
      <span>Each habit</span>
      <span className="font-bold">+5%</span>
    </div>

    <div className="flex justify-between">
      <span>Focus session</span>
      <span className="font-bold">+10%</span>
    </div>

    <div className="flex justify-between">
      <span>Sleep log</span>
      <span className="font-bold">+5%</span>
    </div>

    <div className="pt-4 text-xs opacity-60 italic">
      Resets at midnight.
    </div>
  </CardContent>
</GlassCard>
        </section>
      </div>
    </AppShell>
  );
}
