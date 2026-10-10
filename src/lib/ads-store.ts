import { useSyncExternalStore } from "react";

export type ObjectiveKey = "engagement" | "awareness" | "traffic" | "leads" | "sales" | "app";
export type CampaignStatus = "active" | "paused" | "in_review" | "completed";

export interface Account {
  id: string;
  name: string;
  currency: "INR" | "USD";
  funds: number;
  paymentMethods: string[];
  spendingLimit: number | null;
  taxVerified: boolean;
  transactions: { id: string; date: string; label: string; amount: number }[];
}

export interface Campaign {
  id: string;
  accountId: string;
  name: string;
  objective: ObjectiveKey;
  status: CampaignStatus;
  budgetType: "daily" | "lifetime";
  budget: number;
  startDate: string;
  endDate: string | null;
  audience: { location: string; ageMin: number; ageMax: number; gender: "all" | "men" | "women"; interests: string };
  placements: "advantage" | "manual";
  platforms: string[];
  ad: { headline: string; primaryText: string; cta: string; url: string; image: string };
  results: number;
  spent: number;
  impressions: number;
  reach: number;
  clicks: number;
  createdAt: string;
  recommendations: number;
}

export const OBJECTIVES: Record<
  ObjectiveKey,
  { label: string; desc: string; goodFor: string[]; result: string; color: string; emoji: string }
> = {
  engagement: { label: "Engagement", desc: "Get more messages, video views, post engagement, Page likes or event responses.", goodFor: ["Messages", "Post engagement"], result: "Messaging conversations started", color: "obj-engagement", emoji: "💬" },
  awareness: { label: "Awareness", desc: "Show your ads to people who are most likely to remember them.", goodFor: ["Reach", "Brand awareness"], result: "Reach", color: "obj-awareness", emoji: "📣" },
  traffic: { label: "Traffic", desc: "Send people to a destination, like your website, app or Facebook event.", goodFor: ["Link clicks", "Landing page views"], result: "Link clicks", color: "obj-traffic", emoji: "🚦" },
  leads: { label: "Leads", desc: "Collect leads for your business or brand.", goodFor: ["Instant forms"], result: "Leads", color: "obj-leads", emoji: "📝" },
  sales: { label: "Sales", desc: "Find people likely to purchase your product or service.", goodFor: ["Conversions", "Catalog sales"], result: "Purchases", color: "obj-sales", emoji: "🛒" },
  app: { label: "App promotion", desc: "Find new people to install your app and continue using it.", goodFor: ["App installs", "App events"], result: "App installs", color: "obj-app", emoji: "📱" },
};

export const CTAS = ["Learn more", "Shop now", "Sign up", "Send message", "Book now", "Contact us", "Download", "Get offer"];

interface State {
  accounts: Account[];
  campaigns: Campaign[];
  selectedAccountId: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const uid = (n = 15) => Array.from({ length: n }, (_, i) => (i === 0 ? 1 + Math.floor(Math.random() * 9) : Math.floor(Math.random() * 10))).join("");

function mk(p: Partial<Campaign> & Pick<Campaign, "id" | "accountId" | "name" | "objective" | "status">): Campaign {
  return {
    budgetType: "daily",
    budget: 200,
    startDate: "2026-09-20",
    endDate: null,
    audience: { location: "India", ageMin: 18, ageMax: 65, gender: "all", interests: "" },
    placements: "advantage",
    platforms: ["Facebook", "Instagram", "Messenger"],
    ad: { headline: p.name, primaryText: "Discover something new today.", cta: "Learn more", url: "https://example.com", image: "" },
    results: 0,
    spent: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    createdAt: "2026-09-20",
    recommendations: 0,
    ...p,
  };
}

const SEED: State = {
  selectedAccountId: "1377459896562888",
  accounts: [
    { id: "1377459896562888", name: "Pritam Mousumi", currency: "INR", funds: 0, paymentMethods: [], spendingLimit: null, taxVerified: false, transactions: [] },
    { id: "2841937750163042", name: "Churu Fashion Hub", currency: "INR", funds: 5400, paymentMethods: ["UPI · anuj@okaxis"], spendingLimit: 50000, taxVerified: true, transactions: [{ id: "t1", date: "2026-10-01", label: "Funds added via UPI", amount: 5000 }, { id: "t2", date: "2026-09-15", label: "Funds added via UPI", amount: 2000 }] },
    { id: "3109284475562710", name: "Meena Digital Studio", currency: "INR", funds: 1250, paymentMethods: ["Visa •••• 4242"], spendingLimit: null, taxVerified: true, transactions: [{ id: "t3", date: "2026-09-28", label: "Card charge", amount: 3000 }] },
    { id: "4728105593016647", name: "Desert Brew Cafe", currency: "USD", funds: 120, paymentMethods: ["Mastercard •••• 8810"], spendingLimit: 1000, taxVerified: false, transactions: [] },
  ],
  campaigns: [
    mk({ id: "120210000000000001", accountId: "1377459896562888", name: "New Traffic Campaign", objective: "engagement", status: "active", recommendations: 2 }),
    mk({ id: "120210000000000002", accountId: "2841937750163042", name: "Diwali Sale 2026", objective: "sales", status: "active", budget: 800, results: 46, spent: 3920.5, impressions: 84210, reach: 51230, clicks: 1840, recommendations: 1, ad: { headline: "Diwali Sale – Up to 60% off", primaryText: "Celebrate in style with our festive collection.", cta: "Shop now", url: "https://churufashion.in", image: "" } }),
    mk({ id: "120210000000000003", accountId: "2841937750163042", name: "Brand Awareness – Rajasthan", objective: "awareness", status: "paused", budget: 300, results: 120400, spent: 2105, impressions: 190330, reach: 120400, clicks: 610, audience: { location: "Rajasthan, India", ageMin: 18, ageMax: 45, gender: "all", interests: "Fashion, Shopping" } }),
    mk({ id: "120210000000000004", accountId: "2841937750163042", name: "WhatsApp Inquiries", objective: "engagement", status: "active", budget: 250, results: 312, spent: 1488.2, impressions: 40211, reach: 30122, clicks: 980, recommendations: 3 }),
    mk({ id: "120210000000000005", accountId: "3109284475562710", name: "Lead Gen – Wedding Shoots", objective: "leads", status: "active", budget: 500, results: 58, spent: 2870, impressions: 51003, reach: 33012, clicks: 1203, recommendations: 1 }),
    mk({ id: "120210000000000006", accountId: "3109284475562710", name: "Portfolio Website Visits", objective: "traffic", status: "completed", budgetType: "lifetime", budget: 4000, endDate: "2026-09-30", results: 2210, spent: 4000, impressions: 98000, reach: 61000, clicks: 2210 }),
    mk({ id: "120210000000000007", accountId: "4728105593016647", name: "Coffee App Installs", objective: "app", status: "in_review", budget: 15, results: 0, spent: 0 }),
    mk({ id: "120210000000000008", accountId: "4728105593016647", name: "Weekend Brunch Promo", objective: "traffic", status: "active", budget: 10, results: 340, spent: 42.6, impressions: 12040, reach: 9010, clicks: 340, recommendations: 2 }),
  ],
};

const KEY = "meta-ads-clone-v1";
let state: State = SEED;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
function set(fn: (s: State) => State) {
  state = fn(state);
  emit();
}

export function hydrateStore() {
  if (loaded || typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = JSON.parse(raw);
      listeners.forEach((l) => l());
    }
  } catch {
    /* ignore */
  }
  loaded = true;
  listeners.forEach((l) => l());
}

export function useAds<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(SEED),
  );
}

export const useCurrentAccount = () => useAds((s) => (s.accounts.find((a) => a.id === s.selectedAccountId) ?? s.accounts[0])!);

export const actions = {
  selectAccount: (id: string) => set((s) => ({ ...s, selectedAccountId: id })),
  addAccount: (name: string, currency: "INR" | "USD") => {
    const id = uid(16);
    set((s) => ({ ...s, selectedAccountId: id, accounts: [...s.accounts, { id, name, currency, funds: 0, paymentMethods: [], spendingLimit: null, taxVerified: false, transactions: [] }] }));
    return id;
  },
  updateAccount: (id: string, patch: Partial<Account>) =>
    set((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
  addFunds: (id: string, amount: number, via: string) =>
    set((s) => ({
      ...s,
      accounts: s.accounts.map((a) =>
        a.id === id ? { ...a, funds: a.funds + amount, transactions: [{ id: uid(8), date: today(), label: `Funds added via ${via}`, amount }, ...a.transactions] } : a,
      ),
    })),
  createCampaign: (c: Omit<Campaign, "id" | "results" | "spent" | "impressions" | "reach" | "clicks" | "createdAt" | "recommendations" | "status">) => {
    const id = "1202" + uid(14);
    set((s) => ({ ...s, campaigns: [{ ...c, id, status: "in_review", results: 0, spent: 0, impressions: 0, reach: 0, clicks: 0, createdAt: today(), recommendations: 1 }, ...s.campaigns] }));
    setTimeout(() => actions.updateCampaign(id, { status: "active" }), 6000);
    return id;
  },
  updateCampaign: (id: string, patch: Partial<Campaign>) =>
    set((s) => ({ ...s, campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  duplicateCampaign: (id: string) => {
    const src = state.campaigns.find((c) => c.id === id);
    if (!src) return;
    const nid = "1202" + uid(14);
    set((s) => ({ ...s, campaigns: [{ ...src, id: nid, name: `${src.name} – Copy`, status: "paused", results: 0, spent: 0, impressions: 0, reach: 0, clicks: 0, createdAt: today() }, ...s.campaigns] }));
    return nid;
  },
  deleteCampaign: (id: string) => set((s) => ({ ...s, campaigns: s.campaigns.filter((c) => c.id !== id) })),
  dismissRecommendation: (id: string) =>
    set((s) => ({ ...s, campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, recommendations: Math.max(0, c.recommendations - 1) } : c)) })),
  reset: () => {
    state = SEED;
    emit();
  },
};

export function money(n: number, cur: "INR" | "USD") {
  return new Intl.NumberFormat(cur === "INR" ? "en-IN" : "en-US", { style: "currency", currency: cur, maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);
}
export const num = (n: number) => new Intl.NumberFormat("en-IN").format(n);
export const STATUS_LABEL: Record<CampaignStatus, string> = { active: "Active", paused: "Off", in_review: "In review", completed: "Completed" };

export function useStoreReady() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => loaded,
    () => false,
  );
}
