import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Frame, PageHeader } from "@/components/ads/Shell";
import { actions, useAds } from "@/lib/ads-store";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Select ad account – Ads Manager" },
      { name: "description", content: "Switch between your ad accounts or create a new one." },
      { property: "og:title", content: "Select ad account – Ads Manager" },
      { property: "og:description", content: "Switch between your ad accounts or create a new one." },
    ],
  }),
  component: Accounts,
});

function Accounts() {
  const { accounts, campaigns, selectedAccountId } = useAds((s) => s);
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cur, setCur] = useState<"INR" | "USD">("INR");
  const list = accounts.filter((a) => (a.name + a.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <Frame nav={false}>
      <PageHeader title="Select account" close right={<button aria-label="Add account" onClick={() => setOpen(true)} className="p-1.5"><Plus className="h-6 w-6" /></button>} />
      <div className="p-3">
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search accounts" className="flex-1 bg-transparent outline-none" />
        </div>
      </div>
      <div className="space-y-2 px-3">
        {list.map((a) => {
          const active = campaigns.filter((c) => c.accountId === a.id && c.status === "active").length;
          const sel = a.id === selectedAccountId;
          return (
            <div key={a.id} className={`rounded-lg p-3 ${sel ? "bg-accent" : "bg-card border"}`}>
              <button onClick={() => { actions.selectAccount(a.id); toast.success(`Switched to ${a.name}`); nav({ to: "/" }); }} className="flex w-full items-start gap-4 text-left">
                <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${sel ? "border-primary" : "border-muted-foreground"}`}>{sel && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}</span>
                <span className="flex-1">
                  <span className="block font-bold">{a.name}</span>
                  <span className="block">{a.id} · {a.currency}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" />{active} active campaign{active === 1 ? "" : "s"}</span>
                </span>
              </button>
              {sel && (
                <Link to="/billing" className="mt-2 ml-9 flex items-center justify-center gap-2 rounded-md bg-card py-2 font-medium"><CreditCard className="h-4 w-4" />Billing & payments</Link>
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create new ad account</DialogTitle></DialogHeader>
          <label className="text-sm font-medium">Account name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" /></label>
          <label className="text-sm font-medium">Currency
            <select value={cur} onChange={(e) => setCur(e.target.value as "INR" | "USD")} className="mt-1 w-full rounded-md border px-3 py-2"><option value="INR">Indian Rupee (INR)</option><option value="USD">US Dollar (USD)</option></select>
          </label>
          <button disabled={!name.trim()} onClick={() => { const id = actions.addAccount(name.trim(), cur); setOpen(false); setName(""); toast.success(`Ad account created · ${id}`); nav({ to: "/" }); }} className="rounded-md bg-primary py-2 font-medium text-primary-foreground disabled:opacity-50">Create account</button>
        </DialogContent>
      </Dialog>
    </Frame>
  );
}
