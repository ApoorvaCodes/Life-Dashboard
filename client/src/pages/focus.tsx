import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

const presets = [25, 45, 60] as const;

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusPage() {
  const { focusSessions, setFocusSessions } = useAppContext();

  const [minutes, setMinutes] = useState<(typeof presets)[number]>(25);
  const total = minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(false);

  const tickRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(total);
    setRunning(false);
    completedRef.current = false;
  }, [total]);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }

    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false);
    }

    if (secondsLeft === 0 && !completedRef.current) {
      completedRef.current = true;
      setFocusSessions(focusSessions + 1);
    }
  }, [secondsLeft, running]);

  const done = secondsLeft === 0;
  const progress = useMemo(() => {
    const p = (1 - secondsLeft / total) * 100;
    return Math.max(0, Math.min(100, p));
  }, [secondsLeft, total]);

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.16),transparent_40%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <div className="glass-card rounded-3xl border border-white/5 p-7 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground" data-testid="text-focus-subtitle">
                Focus Mode
              </div>
              <div className="text-2xl sm:text-3xl font-semibold" data-testid="text-focus-title">
                Deep work, one block at a time.
              </div>
              <div className="mt-2 text-sm text-muted-foreground" data-testid="text-focus-sessions">
                Completed today: {focusSessions}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {presets.map((m) => (
                <button
                  key={m}
                  data-testid={`button-preset-${m}`}
                  onClick={() => setMinutes(m)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm ring-1 ring-white/10 transition",
                    m === minutes ? "bg-primary/20 text-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/7",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid place-items-center">
            <div
              className="relative grid place-items-center rounded-full"
              style={{ width: 280, height: 280 }}
              data-testid="timer-ring"
            >
              <svg width="280" height="280" className="-rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="rgba(99,102,241,0.95)"
                  strokeWidth="14"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={(2 * Math.PI * 120 * (100 - progress)) / 100}
                  className="transition-[stroke-dashoffset] duration-300"
                />
              </svg>

              <div className="absolute inset-0 grid place-items-center">
                <div className="text-5xl sm:text-6xl font-semibold tracking-tight" data-testid="text-timer">
                  {formatMMSS(secondsLeft)}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{minutes} min block</div>
              </div>
            </div>

            <AnimatePresence>
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-8 text-center"
                >
                  <div className="text-4xl sm:text-5xl font-semibold text-glow" data-testid="text-times-up">
                    TIME’S UP
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Session recorded (+10%).</div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                data-testid="button-start-pause"
                size="lg"
                onClick={() => setRunning((r) => !r)}
                className="rounded-2xl"
              >
                {running ? (
                  <span className="inline-flex items-center gap-2">
                    <Pause className="h-4 w-4" /> Pause
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Play className="h-4 w-4" /> Start
                  </span>
                )}
              </Button>
              <Button
                data-testid="button-reset"
                size="lg"
                variant="secondary"
                onClick={() => {
                  setSecondsLeft(total);
                  setRunning(false);
                  completedRef.current = false;
                }}
                className="rounded-2xl"
              >
                <span className="inline-flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" /> Reset
                </span>
              </Button>
            </div>

            <div className="mt-6 text-xs text-muted-foreground" data-testid="text-focus-note">
              Complete a session to add +10% to the Dashboard progress.
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            data-testid="link-back-dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← Back to Dashboard
          </a>
        </div>
      </motion.div>
    </div>
  );
}
