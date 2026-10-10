import { Globe, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import type { Campaign } from "@/lib/ads-store";
import { Card } from "./Shell";

export function AdPreview({ name, ad }: { name: string; ad: Campaign["ad"] }) {
  const host = ad.url.replace(/^https?:\/\//, "").split("/")[0] || "website.com";
  return (
    <Card className="overflow-hidden">
      <p className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">Ad preview · Facebook Feed</p>
      <div className="flex items-center gap-2 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{name[0]}</div>
        <div><p className="text-sm font-medium">{name}</p><p className="flex items-center gap-1 text-xs text-muted-foreground">Sponsored · <Globe className="h-3 w-3" /></p></div>
      </div>
      <p className="px-3 pb-2 text-sm">{ad.primaryText || "Your primary text will appear here."}</p>
      {ad.image ? <img src={ad.image} alt="Ad creative" className="aspect-square w-full object-cover" /> : <div className="flex aspect-square w-full items-center justify-center bg-muted text-sm text-muted-foreground">Add an image</div>}
      <div className="flex items-center gap-2 bg-muted px-3 py-2">
        <div className="min-w-0 flex-1"><p className="truncate text-xs uppercase text-muted-foreground">{host}</p><p className="truncate font-medium">{ad.headline || "Headline"}</p></div>
        <span className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium border">{ad.cta}</span>
      </div>
      <div className="flex justify-around border-t py-2 text-sm text-muted-foreground"><span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />Like</span><span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />Comment</span><span className="flex items-center gap-1"><Share2 className="h-4 w-4" />Share</span></div>
    </Card>
  );
}
