import { motion } from "framer-motion";
import { Dumbbell, CalendarDays } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppContext, GymPlan } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const days: { key: keyof GymPlan; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function GymPage() {
  const { gymPlan, setGymPlan } = useAppContext();

  const completed = Object.values(gymPlan).filter(Boolean).length;

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 data-testid="text-gym-title" className="text-3xl font-semibold">
              Gym Plan
            </h1>
            <p className="text-muted-foreground">Check off days you trained. Today feeds the Dashboard progress.</p>
          </div>
          <div className="glass-card rounded-2xl px-4 py-3 border border-white/5" data-testid="card-gym-summary">
            <div className="text-xs text-muted-foreground">This week</div>
            <div className="text-lg font-semibold">{completed}/7</div>
          </div>
        </div>

        <Card className="glass-card rounded-2xl border-white/5 bg-card/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Weekdays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {days.map((d) => {
              const on = gymPlan[d.key];
              return (
                <div
                  key={d.key}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 ring-1 ring-white/7",
                    on ? "bg-primary/10" : "bg-white/3",
                  )}
                  data-testid={`row-gym-${d.key}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
                      <Dumbbell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{d.label}</div>
                      <div className="text-xs text-muted-foreground">Counts as +20% only for today</div>
                    </div>
                  </div>
                  <Switch
                    data-testid={`switch-gym-${d.key}`}
                    checked={on}
                    onCheckedChange={(checked) => {
                      setGymPlan({ ...gymPlan, [d.key]: checked });
                    }}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </AppShell>
  );
}
