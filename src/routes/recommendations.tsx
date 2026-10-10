import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Card, Frame } from "@/components/ads/Shell";
import { actions, useAds, useCurrentAccount, type Campaign } from "@/lib/ads-store";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Opportunities – Ads Manager" },
      { name: "description", content: "Recommendations to improve your campaign performance." },
      { property: "og:title", content: "Opportunities – Ads Manager" },
      { property: "og:description", content: "Recommendations to improve your campaign performance." },
    ],
  }),
  component: Recs,
});

const TIPS: { title: string; body: string; apply: (c: Campaign) => Partial<Campaign> }[] = [
  { title: "Use Advantage+ placements", body: "Expand where your ads are shown to get more results at a lower cost.", apply: () => ({ placements: "advantage" }) },
  { title: "Increase your budget by 20%", body: "Your campaign may be limited by budget. A higher budget could get more results.", apply: (c) => ({ budget: Math.round(c.budget * 1.2) }) },
  { title: "Broaden your audience", body: "Expanding the age range can help the delivery system find more people.", apply: (c) => ({ audience: { ...c.audience, ageMin: 18, ageMax: 65 } }) },
];

function Recs() {
  const acct = useCurrentAccount();
  const list = useAds((s) => s.campaigns).filter((c) => c.accountId === acct.id && c.recommendations > 0);
  return (
    <Frame>
      <header className="px-4 pt-5"><h1 className="text-2xl font-bold">Opportunities</h1><p className="text-sm text-muted-foreground">{acct.name}</p></header>
      <div className="space-y-3 p-4">
        {list.length === 0 && <Card className="p-6 text-center text-muted-foreground">You're all caught up. No recommendations right now.</Card>}
        {list.flatMap((c) => TIPS.slice(0, c.recommendations).map((t, i) => (
          <Card key={c.id + i} className="p-4">
            <div className="flex gap-3"><Lightbulb className="h-5 w-5 shrink-0 text-primary" /><div>
              <p className="font-medium">{t.title}</p><p className="text-sm text-muted-foreground">{t.body}</p>
              <Link to="/campaign/$id" params={{ id: c.id }} className="mt-1 block text-xs text-primary">{c.name}</Link>
            </div></div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { actions.updateCampaign(c.id, t.apply(c)); actions.dismissRecommendation(c.id); toast.success("Recommendation applied"); }} className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground">Apply</button>
              <button onClick={() => { actions.dismissRecommendation(c.id); toast("Dismissed"); }} className="flex-1 rounded-md bg-secondary py-2 text-sm font-medium">Dismiss</button>
            </div>
          </Card>
        )))}
      </div>
    </Frame>
  );
}
