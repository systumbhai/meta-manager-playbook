import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Frame, ObjectiveIcon, PageHeader } from "@/components/ads/Shell";
import { OBJECTIVES, type ObjectiveKey } from "@/lib/ads-store";
import { DuplicateSheet } from "@/components/ads/DuplicateSheet";

export const Route = createFileRoute("/create/")({
  head: () => ({
    meta: [
      { title: "Create new campaign – Ads Manager" },
      { name: "description", content: "Choose your campaign objective: engagement, awareness, traffic, leads, sales or app promotion." },
      { property: "og:title", content: "Create new campaign – Ads Manager" },
      { property: "og:description", content: "Choose your campaign objective to get started." },
    ],
  }),
  component: CreatePick,
});

function CreatePick() {
  const [dup, setDup] = useState(false);
  return (
    <Frame nav={false}>
      <PageHeader title="Create new campaign" close />
      <div className="flex gap-2 px-4 pt-4">
        <span className="rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground">Create new</span>
        <button onClick={() => setDup(true)} className="px-3 py-2">Create from existing</button>
      </div>
      <h2 className="px-4 pt-5 text-lg font-bold">What's your objective?</h2>
      <div className="divide-y px-4">
        {(Object.keys(OBJECTIVES) as ObjectiveKey[]).map((k) => {
          const o = OBJECTIVES[k];
          return (
            <Link key={k} to="/create/$objective" params={{ objective: k }} search={{}} className="flex items-center gap-4 py-4">
              <ObjectiveIcon k={k} size="lg" />
              <span className="flex-1">
                <span className="block text-lg font-medium">{o.label}</span>
                <span className="block text-sm text-muted-foreground">{o.desc}</span>
                <span className="mt-1 flex flex-wrap gap-3 text-sm"><b>Good for:</b>{o.goodFor.map((g) => <span key={g}>{g}</span>)}</span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
      <DuplicateSheet open={dup} onOpenChange={setDup} />
    </Frame>
  );
}
