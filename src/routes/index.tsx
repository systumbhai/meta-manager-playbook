import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, Copy, Filter, Plus, Search, Settings, Table2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CampaignCard, statusColor } from "@/components/ads/CampaignCard";
import { Card, Frame } from "@/components/ads/Shell";
import { actions, money, num, OBJECTIVES, STATUS_LABEL, useAds, useCurrentAccount, type CampaignStatus } from "@/lib/ads-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ads Manager – Campaigns" },
      { name: "description", content: "View and manage all your ad campaigns, spend and results in one place." },
      { property: "og:title", content: "Ads Manager – Campaigns" },
      { property: "og:description", content: "View and manage all your ad campaigns, spend and results in one place." },
    ],
  }),
  component: Home,
});

const DATES = { today: ["Today", 0.05], "7d": ["Last 7 days", 0.3], "30d": ["Last 30 days", 0.85], max: ["Maximum", 1] } as const;
type DateKey = keyof typeof DATES;

function Home() {
  const acct = useCurrentAccount();
  const all = useAds((s) => s.campaigns);
  const nav = useNavigate();
  const [date, setDate] = useState<DateKey>("max");
  const [status, setStatus] = useState<CampaignStatus | "all">("all");
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [table, setTable] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [dupOpen, setDupOpen] = useState(false);
  const factor = DATES[date][1];

  const mine = all.filter((c) => c.accountId === acct.id);
  const list = useMemo(
    () => mine.filter((c) => (status === "all" || c.status === status) && c.name.toLowerCase().includes(q.toLowerCase())),
    [mine, status, q],
  );
  const activeCount = mine.filter((c) => c.status === "active").length;
  const totalSpent = mine.reduce((s, c) => s + c.spent * factor, 0);

  return (
    <Frame>
      <header className="flex items-center gap-3 px-4 pt-4">
        <Link to="/billing" aria-label="Settings" className="rounded-full border bg-card p-2"><Settings className="h-5 w-5" /></Link>
        <Link to="/accounts" className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-xl font-bold">{acct.name}<ChevronDown className="h-5 w-5 shrink-0" /></p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" />{activeCount} active campaign{activeCount === 1 ? "" : "s"}</p>
        </Link>
        <button aria-label="Notifications" onClick={() => toast("No new notifications")} className="p-2"><Bell className="h-6 w-6" /></button>
        <button aria-label="Create" onClick={() => setCreateOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-primary-foreground"><Plus className="h-6 w-6" /></button>
      </header>

      <div className="flex gap-2 px-4 pt-4">
        <button aria-label="Reset filters" onClick={() => { setStatus("all"); setDate("max"); setQ(""); }} className="rounded-md border bg-card px-3 py-2"><Filter className="h-4 w-4" /></button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded-md border bg-card px-3 py-2 text-sm font-medium">{date === "max" ? "Date" : DATES[date][0]}<ChevronDown className="h-4 w-4" /></DropdownMenuTrigger>
          <DropdownMenuContent>{(Object.keys(DATES) as DateKey[]).map((k) => <DropdownMenuItem key={k} onClick={() => setDate(k)}>{DATES[k][0]}</DropdownMenuItem>)}</DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded-md border bg-card px-3 py-2 text-sm font-medium">{status === "all" ? "Status" : STATUS_LABEL[status]}<ChevronDown className="h-4 w-4" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatus("all")}>All</DropdownMenuItem>
            {(Object.keys(STATUS_LABEL) as CampaignStatus[]).map((k) => <DropdownMenuItem key={k} onClick={() => setStatus(k)}>{STATUS_LABEL[k]}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 pt-4">
        <Link to="/billing"><Card className="flex items-start p-3">
          <div className="flex-1"><p className="text-xs text-muted-foreground">Total amount spent</p><p className="text-xl font-bold">{money(totalSpent, acct.currency)}</p></div>
          <p className="flex-1 text-xs text-muted-foreground">{acct.spendingLimit ? `Limit ${money(acct.spendingLimit, acct.currency)}` : "No spending limit"}</p>
          <ChevronRight className="h-4 w-4" />
        </Card></Link>
      </div>

      <div className="flex items-center px-4 pt-6">
        <h2 className="flex-1 text-xl font-bold">Campaigns</h2>
        <button aria-label="Search" onClick={() => setSearching((v) => !v)} className="p-2"><Search className="h-5 w-5" /></button>
        <button aria-label="Table view" onClick={() => setTable((v) => !v)} className={`rounded p-2 ${table ? "bg-accent text-accent-foreground" : ""}`}><Table2 className="h-5 w-5" /></button>
      </div>
      {searching && (
        <div className="relative px-4 pt-2">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns" className="w-full rounded-full border bg-card px-4 py-2 text-sm outline-none focus:border-primary" />
          {q && <button aria-label="Clear" onClick={() => setQ("")} className="absolute right-7 top-4"><X className="h-4 w-4" /></button>}
        </div>
      )}

      <div className="space-y-3 px-4 pt-3">
        {list.length === 0 && (
          <Card className="p-6 text-center">
            <p className="font-medium">No campaigns found</p>
            <p className="mt-1 text-sm text-muted-foreground">Create a campaign to start reaching people.</p>
            <button onClick={() => nav({ to: "/create" })} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create campaign</button>
          </Card>
        )}
        {table && list.length > 0 ? (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs text-muted-foreground"><tr><th className="p-2">Campaign</th><th className="p-2">Status</th><th className="p-2 text-right">Results</th><th className="p-2 text-right">Spent</th></tr></thead>
              <tbody>{list.map((c) => (
                <tr key={c.id} className="border-t" onClick={() => nav({ to: "/campaign/$id", params: { id: c.id } })}>
                  <td className="p-2 font-medium">{c.name}<div className="text-xs text-muted-foreground">{OBJECTIVES[c.objective].label}</div></td>
                  <td className={`p-2 ${statusColor(c.status)}`}>{STATUS_LABEL[c.status]}</td>
                  <td className="p-2 text-right">{num(Math.round(c.results * factor))}</td>
                  <td className="p-2 text-right">{money(c.spent * factor, acct.currency)}</td>
                </tr>))}</tbody>
            </table>
          </Card>
        ) : list.map((c) => <CampaignCard key={c.id} c={c} currency={acct.currency} factor={factor} />)}
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-2xl p-0">
          <SheetHeader className="p-4"><SheetTitle className="text-center">Create</SheetTitle></SheetHeader>
          <button onClick={() => { setCreateOpen(false); nav({ to: "/create" }); }} className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-muted">
            <span className="rounded-lg border p-3"><Plus className="h-5 w-5" /></span>
            <span className="flex-1"><span className="block font-medium">Create campaign</span><span className="text-sm text-muted-foreground">Create and publish a new campaign</span></span><ChevronRight className="h-5 w-5" />
          </button>
          <button onClick={() => { setCreateOpen(false); setDupOpen(true); }} className="mb-6 flex w-full items-center gap-4 border-t px-4 py-4 text-left hover:bg-muted">
            <span className="rounded-lg border p-3"><Copy className="h-5 w-5" /></span>
            <span className="flex-1"><span className="block font-medium">Duplicate existing</span><span className="text-sm text-muted-foreground">Create using an existing campaign</span></span><ChevronRight className="h-5 w-5" />
          </button>
        </SheetContent>
      </Sheet>
      <DuplicateSheet open={dupOpen} onOpenChange={setDupOpen} />
    </Frame>
  );
}

export function DuplicateSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const acct = useCurrentAccount();
  const list = useAds((s) => s.campaigns).filter((c) => c.accountId === acct.id);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[80vh] max-w-md overflow-y-auto rounded-t-2xl">
        <SheetHeader><SheetTitle className="text-center">Choose a campaign to duplicate</SheetTitle></SheetHeader>
        <div className="mt-2 divide-y">
          {list.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No campaigns in this account yet.</p>}
          {list.map((c) => (
            <button key={c.id} onClick={() => { actions.duplicateCampaign(c.id); onOpenChange(false); toast.success(`Duplicated "${c.name}" (Off)`); }} className="flex w-full items-center justify-between py-3 text-left">
              <span><span className="block font-medium">{c.name}</span><span className="text-xs text-muted-foreground">{OBJECTIVES[c.objective].label} · ID {c.id}</span></span><ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
