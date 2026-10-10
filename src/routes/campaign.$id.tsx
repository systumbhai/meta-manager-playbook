import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdPreview } from "@/components/ads/AdPreview";
import { statusColor } from "@/components/ads/CampaignCard";
import { Card, Frame, ObjectiveIcon, PageHeader } from "@/components/ads/Shell";
import { actions, money, num, OBJECTIVES, STATUS_LABEL, useAds, useStoreReady } from "@/lib/ads-store";

export const Route = createFileRoute("/campaign/$id")({
  head: () => ({
    meta: [
      { title: "Campaign insights – Ads Manager" },
      { name: "description", content: "Results, spend, budget, audience and ad preview for this campaign." },
      { property: "og:title", content: "Campaign insights – Ads Manager" },
      { property: "og:description", content: "Results, spend, budget, audience and ad preview for this campaign." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const c = useAds((s) => s.campaigns.find((x) => x.id === id));
  const acct = useAds((s) => s.accounts.find((a) => a.id === c?.accountId));
  const nav = useNavigate();
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const ready = useStoreReady();

  if (!ready && !c) return <Frame><PageHeader title="Campaign" /></Frame>;

  if (!c || !acct) return (
    <Frame><PageHeader title="Campaign" /><p className="p-8 text-center text-muted-foreground">This campaign no longer exists. <Link to="/" className="text-primary">Go back</Link></p></Frame>
  );
  const cur = acct.currency;
  const o = OBJECTIVES[c.objective];
  const stats: [string, string][] = [
    [o.result, num(c.results)],
    ["Cost per result", money(c.results ? c.spent / c.results : 0, cur)],
    ["Amount spent", money(c.spent, cur)],
    ["Reach", num(c.reach)],
    ["Impressions", num(c.impressions)],
    ["Link clicks", num(c.clicks)],
    ["CTR", `${c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00"}%`],
    ["CPM", money(c.impressions ? (c.spent / c.impressions) * 1000 : 0, cur)],
    ["Frequency", c.reach ? (c.impressions / c.reach).toFixed(2) : "0.00"],
  ];
  const pct = c.budgetType === "lifetime" ? Math.min(100, (c.spent / c.budget) * 100) : null;

  return (
    <Frame>
      <PageHeader title="Campaign" right={<button aria-label="Edit" onClick={() => nav({ to: "/create/$objective", params: { objective: c.objective }, search: { edit: c.id } })} className="p-1.5"><Pencil className="h-5 w-5" /></button>} />
      <div className="space-y-3 p-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ObjectiveIcon k={c.objective} />
            <div className="min-w-0 flex-1"><p className="truncate text-lg font-medium">{c.name}</p><p className="text-sm"><span className={statusColor(c.status)}>{STATUS_LABEL[c.status]}</span><span className="text-muted-foreground"> • {o.label}</span></p></div>
            <Switch disabled={c.status === "completed" || c.status === "in_review"} checked={c.status === "active" || c.status === "in_review"} onCheckedChange={(v) => { actions.updateCampaign(c.id, { status: v ? "active" : "paused" }); toast.success(v ? "Campaign turned on" : "Campaign turned off"); }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Campaign ID: {c.id} · Created {c.createdAt}</p>
          {c.status === "in_review" && <p className="mt-2 rounded-md bg-muted p-2 text-sm">Your ad is being reviewed. Most ads are reviewed within 24 hours.</p>}
          {c.status !== "paused" && acct.paymentMethods.length === 0 && acct.funds <= 0 && (
            <Link to="/billing" className="mt-2 block rounded-md border border-destructive p-2 text-sm text-destructive">No payment method — add one so this campaign can deliver.</Link>
          )}
        </Card>

        <Card className="grid grid-cols-3 gap-y-4 p-4">
          {stats.map(([k, v]) => <div key={k}><p className="font-medium">{v}</p><p className="text-xs text-muted-foreground leading-tight">{k}</p></div>)}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between"><p className="font-bold">Budget & schedule</p><button onClick={() => { setBudget(String(c.budget)); setBudgetOpen(true); }} className="text-sm font-medium text-primary">Edit</button></div>
          <p className="mt-1 text-sm">{money(c.budget, cur)} {c.budgetType === "daily" ? "per day" : "lifetime"}</p>
          {pct !== null && <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>}
          <p className="text-sm text-muted-foreground">{c.startDate} → {c.endDate ?? "Ongoing"}</p>
        </Card>

        <Card className="p-4 text-sm">
          <p className="font-bold">Audience</p>
          <p>{c.audience.location} · Age {c.audience.ageMin}–{c.audience.ageMax}{c.audience.ageMax === 65 ? "+" : ""} · {c.audience.gender === "all" ? "All genders" : c.audience.gender}</p>
          {c.audience.interests && <p className="text-muted-foreground">Interests: {c.audience.interests}</p>}
          <p className="mt-3 font-bold">Placements</p>
          <p>{c.placements === "advantage" ? "Advantage+ placements" : c.platforms.join(", ")}</p>
        </Card>

        <AdPreview name={acct.name} ad={c.ad} />

        <div className="flex gap-2">
          <button onClick={() => { const nid = actions.duplicateCampaign(c.id); toast.success("Campaign duplicated"); if (nid) nav({ to: "/campaign/$id", params: { id: nid } }); }} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-secondary py-2.5 font-medium"><Copy className="h-4 w-4" />Duplicate</button>
          <button onClick={() => { if (confirm(`Delete "${c.name}"?`)) { actions.deleteCampaign(c.id); toast("Campaign deleted"); nav({ to: "/" }); } }} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-secondary py-2.5 font-medium text-destructive"><Trash2 className="h-4 w-4" />Delete</button>
        </div>
      </div>

      <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit {c.budgetType} budget</DialogTitle></DialogHeader>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="rounded-md border px-3 py-2" />
          <button disabled={!(Number(budget) > 0)} onClick={() => { actions.updateCampaign(c.id, { budget: Number(budget) }); setBudgetOpen(false); toast.success("Budget updated"); }} className="rounded-md bg-primary py-2 font-medium text-primary-foreground disabled:opacity-50">Save</button>
        </DialogContent>
      </Dialog>
    </Frame>
  );
}
