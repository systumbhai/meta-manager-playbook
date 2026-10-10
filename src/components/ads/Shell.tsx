import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, Home, Lightbulb, X } from "lucide-react";
import type { ReactNode } from "react";
import { OBJECTIVES, type ObjectiveKey } from "@/lib/ads-store";

export function Frame({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="mx-auto min-h-screen max-w-md app-bg relative shadow-xl">
      <div className={nav ? "pb-20" : "pb-6"}>{children}</div>
      {nav && <BottomNav />}
    </div>
  );
}

function BottomNav() {
  const item = "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs text-muted-foreground";
  const active = { className: "text-primary" };
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 border-t bg-card">
      <Link to="/" className={item} activeProps={active} activeOptions={{ exact: true }}><Home className="h-6 w-6" />Home</Link>
      <Link to="/recommendations" className={item} activeProps={active}><Lightbulb className="h-6 w-6" />Opportunities</Link>
      <Link to="/help" className={item} activeProps={active}><HelpCircle className="h-6 w-6" />Help</Link>
    </nav>
  );
}

export function PageHeader({ title, close, right }: { title: string; close?: boolean; right?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card px-3 py-3">
      <button aria-label="Back" onClick={() => router.history.back()} className="rounded-full p-1.5 hover:bg-muted">
        {close ? <X className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
      </button>
      <h1 className="flex-1 truncate text-center text-lg font-medium">{title}</h1>
      <div className="min-w-9 flex justify-end">{right}</div>
    </header>
  );
}

const bg: Record<ObjectiveKey, string> = {
  engagement: "bg-obj-engagement", awareness: "bg-obj-awareness", traffic: "bg-obj-traffic",
  leads: "bg-obj-leads", sales: "bg-obj-sales", app: "bg-obj-app",
};
export function ObjectiveIcon({ k, size = "md" }: { k: ObjectiveKey; size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 text-3xl" : "h-10 w-10 text-lg";
  return <div className={`${bg[k]} ${s} flex shrink-0 items-center justify-center rounded-full`}>{OBJECTIVES[k].emoji}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-card shadow-sm ${className}`}>{children}</div>;
}
