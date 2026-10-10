import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, Frame } from "@/components/ads/Shell";
import { actions } from "@/lib/ads-store";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help – Ads Manager" },
      { name: "description", content: "Answers about campaigns, billing, ad review and objectives." },
      { property: "og:title", content: "Help – Ads Manager" },
      { property: "og:description", content: "Answers about campaigns, billing, ad review and objectives." },
    ],
  }),
  component: Help,
});

const FAQ: [string, string][] = [
  ["How do I create a campaign?", "Tap the + button on Home, choose Create campaign, pick an objective, then set budget, audience, placements and your ad before publishing."],
  ["Why is my ad in review?", "Every new ad is checked against advertising standards. Most reviews finish within 24 hours."],
  ["When am I charged?", "With prepaid funds, money is deducted about once a day while your ads run. If funds run out, ads pause."],
  ["How do I switch ad accounts?", "Tap the account name at the top of Home and pick another account."],
  ["What does cost per result mean?", "It's the amount spent divided by the number of results your objective counts, like link clicks or messages."],
];

function Help() {
  return (
    <Frame>
      <header className="px-4 pt-5"><h1 className="text-2xl font-bold">Help</h1></header>
      <div className="space-y-4 p-4">
        <Card className="px-4">
          <Accordion type="single" collapsible>
            {FAQ.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}
          </Accordion>
        </Card>
        <button onClick={() => { if (confirm("Reset all accounts and campaigns to sample data?")) { actions.reset(); toast.success("Demo data restored"); } }} className="w-full rounded-md bg-secondary py-2.5 font-medium">Reset demo data</button>
      </div>
    </Frame>
  );
}
