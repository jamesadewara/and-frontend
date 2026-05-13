export type Mode = "review" | "recommend";
export type Phase = "intro" | "loading" | "streaming" | "done";

export interface Recommendation {
  id?: string;
  rank?: number;
  item?: string;
  title?: string;
  category: string;
  estimated_price?: string;
  price?: number;
  image?: string;
  location?: string;
  score: number;
  reason?: string;
  reasoning?: string;
  meta?: string;
  similar_users?: number;
}

export interface ReviewData {
  predicted_rating: number;
  review_text: string;
  style_markers_used?: string[];
  price_shock_score?: number;
  cultural_fidelity_score?: number;
}

export type Block =
  | { kind: "text"; text: string }
  | { kind: "rec"; data: Recommendation }
  | { kind: "review"; data: ReviewData };

export interface Message {
  id: string;
  from: "user" | "agent";
  blocks: Block[];
  timestamp: number;
  hasAnalysis?: boolean;
  hasSimulator?: boolean;
  metadata?: {
    recommendations?: any[];
    reasoning_chain?: string[];
    review?: any;
    [key: string]: any;
  };
}

export interface AgentOutput {
  predicted_rating?: number;
  review_text?: string;
  recommendations?: Recommendation[];
  used_nigerian_markers?: string[];
  sentence_count?: number;
  confidence?: number;
  cold_start_used?: boolean;
  cross_domain?: boolean;
  style_snapshot?: any;
  [key: string]: unknown;
}

export interface AgentResponse {
  review_text?: string;
  predicted_rating?: number;
  recommendations?: Recommendation[];
  reasoning_chain?: any[];
  [key: string]: unknown;
}

export const REVIEW_TEMPLATES: Record<string, unknown> = {
  "The Lagos Haggler": {
    user_persona: {
      name: "Chinedu Okafor",
      location: "Lagos",
      archetype: "The Haggler",
      interests: ["street_food", "electronics", "tech_gadgets"],
      traits: ["price_sensitive", "direct", "skeptical_of_hype"],
      tone: "casual",
      style_sample: "Omo! This thing sweet die but why them go charge ₦3500?",
      nigerian_context: true,
      budget: 5000,
      price_sensitivity: "high",
      past_reviews: [
        {
          product_name: "Party Jollof + Chicken",
          rating: 3,
          text: "The rice sweet well well but ₦3000 too much for this small portion.",
          date: "2026-04-10",
        },
      ],
    },
    product: {
      name: "Oraimo FreePods 3 Wireless Earbuds",
      category: "electronics",
      description: "Bluetooth 5.3 earbuds, 35-hour battery, IPX5, USB-C. Price: ₦24,500.",
      price: 24500,
    },
  },
  "The Abuja Big Woman": {
    user_persona: {
      name: "Amina Bello",
      location: "Abuja",
      archetype: "The Big Woman",
      interests: ["luxury_dining", "wellness", "fashion"],
      traits: ["status_conscious", "quality_over_price", "formal"],
      tone: "formal",
      style_sample: "",
      nigerian_context: true,
      budget: 50000,
      price_sensitivity: "low",
      past_reviews: [],
    },
    product: {
      name: "Signature Amala & Ewedu with Assorted Meats",
      category: "fine_dining",
      description: "Premium Yoruba dish in ceramicware. Goat meat, beef, tripe. ₦8,500.",
      price: 8500,
    },
  },
  "The PH Code-Mixer": {
    user_persona: {
      name: "Kelechi from PH",
      location: "Port Harcourt",
      archetype: "The Community Validator",
      interests: ["nollywood", "local_cuisine", "community_events"],
      traits: ["social", "trusts_word_of_mouth", "emotional"],
      tone: "energetic",
      style_sample: "My people!!! This film na fire 🔥🔥.",
      nigerian_context: true,
      budget: 10000,
      price_sensitivity: "medium",
      past_reviews: [
        {
          product_name: "The Wedding Party (Nollywood)",
          rating: 5,
          text: "My people!!! This film na fire 🔥🔥. 5 stars no be joke!",
          date: "2026-03-15",
        },
      ],
    },
    product: {
      name: "King of Boys: The Return of the King",
      category: "nollywood",
      description: "Netflix series. Political thriller. 7 episodes. ₦1,200 rental.",
      price: 1200,
    },
  },
  "Blank Template": {
    user_persona: {
      name: "",
      location: "",
      archetype: "",
      interests: [],
      traits: [],
      tone: "",
      style_sample: "",
      nigerian_context: true,
      budget: 0,
      price_sensitivity: "medium",
      past_reviews: [],
    },
    product: { name: "", category: "", description: "", price: 0 },
  },
};

export const RECOMMEND_TEMPLATES: Record<string, unknown> = {
  "Cold-Start Haggler": {
    user_persona: {
      name: "Chinedu Okafor",
      location: "Lagos",
      archetype: "The Haggler",
      interests: ["street_food", "electronics"],
      traits: ["price_sensitive", "direct"],
      tone: "casual",
      style_sample: "Omo! This thing sweet die but why them go charge ₦3500?",
      nigerian_context: true,
      budget: 5000,
      price_sensitivity: "high",
      past_reviews: [],
    },
    context: {
      location: "Lagos",
      time_of_day: "evening",
      occasion: "quick dinner after work",
      conversation_history: [],
    },
  },
  "Cross-Domain User": {
    user_persona: {
      name: "Kelechi from PH",
      location: "Port Harcourt",
      archetype: "The Community Validator",
      interests: ["nollywood", "street_food", "community_events"],
      traits: ["social", "trusts_word_of_mouth"],
      tone: "energetic",
      style_sample: "My people!!! This film na fire 🔥🔥.",
      nigerian_context: true,
      budget: 10000,
      price_sensitivity: "medium",
      past_reviews: [
        {
          product_name: "The Wedding Party",
          rating: 5,
          text: "My people!!! This film na fire 🔥🔥. 5 stars no be joke!",
          date: "2026-03-15",
        },
      ],
    },
    context: {
      location: "Port Harcourt",
      time_of_day: "night",
      occasion: "movie night with friends",
      conversation_history: [],
    },
  },
  "Multiturn User": {
    user_persona: {
      name: "Amina Bello",
      location: "Abuja",
      archetype: "The Big Woman",
      interests: ["luxury_dining", "wellness", "fashion"],
      traits: ["status_conscious", "quality_over_price"],
      tone: "formal",
      style_sample: "",
      nigerian_context: true,
      budget: 50000,
      price_sensitivity: "low",
      past_reviews: [],
    },
    context: {
      location: "Abuja",
      time_of_day: "evening",
      occasion: "business dinner",
      conversation_history: [
        { role: "user", message: "I want something nice for dinner" },
        { role: "agent", message: "How about RSVP Lagos?" },
        { role: "user", message: "Too far. Something in Abuja." },
        { role: "agent", message: "Fine dining or casual?" },
        { role: "user", message: "Fine dining, not more than ₦15,000 per person." },
      ],
    },
  },
  "Blank Template": {
    user_persona: {
      name: "",
      location: "",
      archetype: "",
      interests: [],
      traits: [],
      tone: "",
      nigerian_context: true,
      budget: 0,
      price_sensitivity: "medium",
      past_reviews: [],
    },
    context: { location: "", time_of_day: "", occasion: "", conversation_history: [] },
  },
};

export const REVIEW_INTRO = `Hey! I'm your Review Agent 👋

Paste or build a JSON payload on the right with a user persona and product details. I'll simulate how that Nigerian consumer would really feel about the product — complete with Pidgin flair, price shock reactions, and authentic style.

Hit Submit when you're ready and I'll walk you through my reasoning.`;

export const RECOMMEND_INTRO = `Hey! I'm your Recommendation Agent 👋

Give me a user persona and some context — location, occasion, time of day — and I'll rank the best products for them using cultural scoring, location-aware boosting, and cold-start inference.

Hit Submit when you're ready.`;

export function validatePayload(mode: Mode, raw: string): { ok: boolean; parseError?: string; missing: string[]; data?: unknown } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    const m = /position (\d+)/.exec(msg);
    let line: number | undefined;
    if (m) {
      const pos = Number(m[1]);
      line = raw.slice(0, pos).split("\n").length;
    }
    return { ok: false, missing: [], parseError: line ? `Invalid JSON at line ${line}: ${msg}` : `Invalid JSON: ${msg}` };
  }
  const missing: string[] = [];
  const need = (path: string, val: unknown, type?: string) => {
    if (val === undefined || val === null || val === "") {
      missing.push(path);
      return;
    }
    if (type === "number" && (typeof val !== "number" || isNaN(val as number))) {
      missing.push(`${path} (must be a number)`);
    }
    if (type === "array" && (!Array.isArray(val) || val.length === 0)) {
      missing.push(`${path} (must be a non-empty array)`);
    }
  };

  const up = (data as Record<string, unknown>)?.user_persona as Record<string, unknown> ?? {};
  need("user_persona.name", up.name);
  need("user_persona.location", up.location);
  need("user_persona.archetype", up.archetype);
  need("user_persona.budget", up.budget, "number");

  if (mode === "review") {
    const p = (data as Record<string, unknown>)?.product as Record<string, unknown> ?? {};
    need("product.name", p.name);
    need("product.category", p.category);
    need("product.price", p.price, "number");
  } else {
    const c = (data as Record<string, unknown>)?.context as Record<string, unknown> ?? {};
    need("context.location", c.location);
    need("context.time_of_day", c.time_of_day);
    need("context.occasion", c.occasion);
  }
  return { ok: missing.length === 0, missing, data };
}
