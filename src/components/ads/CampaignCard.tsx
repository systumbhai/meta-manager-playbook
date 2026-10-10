import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Lightbulb, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { actions, money, num, OBJECTIVES, STATUS_LABEL, type Campaign } from "@/lib/ads-store";
import { Card, ObjectiveIcon } from "./Shell";

export const statusColor = (s: Campaign["status"]) =>
  s === "active" ? "text-success" : s === "in_review" ? "text-warning" : "text-muted-foreground";
export const statusDot = (s: Campaign["status"]) =>
  s === "active" ? "bg-success" : s === "in_review" ? "bg-warning" : "bg-muted-foreground";

export function CampaignCard({ c, currency, factor }: { c: Campaign; currency: "INR" | "USD"; factor: number }) {
  const nav = useNavigate();
  const results = Math.round(c.results * factor);
  const spent = c.spent * factor;
  const cpr = results ? spent / results : 0;
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <div className="relative">
          <ObjectiveIcon k={c.objective} />
          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusDot(c.status)}`} />
        </div>
        <Link to="/campaign/$id" params={{ id: c.id }} className="min-w-0 flex-1">
          <p className="truncate font-medium">{c.name}</p>
          <p className="text-sm"><span className={statusColor(c.status)}>{STATUS_LABEL[c.status]}</span><span className="text-muted-foreground"> • {OBJECTIVES[c.objective].label}</span></p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Campaign options" className="rounded-full p-1 hover:bg-muted"><MoreVertical className="h-5 w-5" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => nav({ to: "/campaign/$id", params: { id: c.id } })}>View insights</DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav({ to: "/create/$objective", params: { objective: c.objective }, search: { edit: c.id } })}>Edit</DropdownMenuItem>
            {c.status !== "completed" && (
              <DropdownMenuItem onClick={() => { actions.updateCampaign(c.id, { status: c.status === "paused" ? "active" : "paused" }); toast.success(c.status === "paused" ? "Campaign turned on" : "Campaign turned off"); }}>
                {c.status === "paused" ? "Turn on" : "Turn off"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => { actions.duplicateCampaign(c.id); toast.success("Campaign duplicated"); }}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm(`Delete "${c.name}"?`)) { actions.deleteCampaign(c.id); toast("Campaign deleted"); } }}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x text-sm">
        <div className="pr-2"><p className="text-base font-medium">{num(results)}</p><p className="text-muted-foreground leading-tight">{OBJECTIVES[c.objective].result}</p></div>
        <div className="px-2"><p className="text-base font-medium">{money(cpr, currency)}</p><p className="text-muted-foreground leading-tight">Cost per {OBJECTIVES[c.objective].result.replace(/s$/, "")}</p></div>
        <div className="pl-2"><p className="text-base font-medium">{money(spent, currency)}</p><p className="text-muted-foreground">Spent</p></div>
      </div>
      {c.recommendations > 0 && (
        <Link to="/recommendations" className="mt-3 flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          <Lightbulb className="h-4 w-4" /><span className="flex-1">{c.recommendations} recommendation{c.recommendations > 1 ? "s" : ""}</span><ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </Card>
  );
}
