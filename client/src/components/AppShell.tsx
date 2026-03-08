import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Dumbbell, Focus, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gym", label: "Gym", icon: Dumbbell },
  { href: "/focus", label: "Focus", icon: Focus },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen">
      <header className="glass-panel sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-xl bg-primary/15 ring-1 ring-white/10 grid place-items-center"
                aria-hidden="true"
              >
                <div className="size-4 rounded-full bg-primary/70 shadow-[0_0_24px_rgba(99,102,241,0.65)]" />
              </div>
              <div className="leading-tight">
                <div className="text-sm text-muted-foreground">Life Dashboard</div>
                <div className="text-base font-semibold">Daily Systems</div>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              {nav.map((item) => {
                const active = location === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                      "hover:bg-white/5 hover:backdrop-blur",
                      active
                        ? "bg-white/7 ring-1 ring-white/10 text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 transition", active ? "text-primary" : "group-hover:text-foreground")} strokeWidth={2} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
