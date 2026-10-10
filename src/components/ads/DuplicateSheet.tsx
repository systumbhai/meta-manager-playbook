import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { actions, OBJECTIVES, useAds, useCurrentAccount } from "@/lib/ads-store";

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
