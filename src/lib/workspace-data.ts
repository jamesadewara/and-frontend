export type Mode = "review" | "recommend";

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

export const REVIEW_REASONING = [
  "🔍 Analyzing user archetype: The Haggler (high price sensitivity)",
  "💰 Calculating Price Shock: ₦24,500 vs ₦5,000 budget...",
  "📊 TotalShock = log₂(24500/5000) × 2.5 = 5.78",
  "✍️ Adapting tone: casual Pidgin with price-complaint markers...",
  "🔁 Reflecting: checking sentiment-rating alignment...",
  "✅ Output ready.",
];

export const RECOMMEND_REASONING = [
  "🔍 Parsing user archetype: The Haggler in Lagos",
  "🛡️ Applying hard constraint: budget ≤ ₦5,000",
  "🍽️ Occasion: quick dinner after work → prioritizing food & convenience",
  "📍 Location boost: Lagos-specific vendors get +15.0 score",
  "🧊 Cold-start mode: no past reviews → using demographic defaults",
  "📊 Ranking 8 candidate items...",
  "🎨 Diversity check: ensuring cross-category spread ✓",
];

export const REVIEW_RESPONSE = {
  status: "success",
  agent: "AnD Review Agent v1.0",
  archetype_detected: "The Haggler",
  reasoning_steps: REVIEW_REASONING,
  output: {
    predicted_rating: 1.0,
    review_text:
      "Omo, ₦24,500 for earbuds?! Abeg, who dem dey sell to? My whole month feeding budget no reach am. The specs fine sha but this economy no dey carry that kind price. I go just manage my old one. 1 star for the wahala.",
    style_markers_used: ["Omo", "Abeg", "sha", "no dey"],
    price_shock_score: 5.78,
    cultural_fidelity_score: 0.94,
  },
};

export const RECOMMEND_RESPONSE = {
  status: "success",
  agent: "AnD Recommendation Agent v1.0",
  reasoning_steps: RECOMMEND_REASONING,
  output: {
    recommendations: [
      {
        rank: 1,
        item: "Mama Put Jollof Rice + Fried Fish",
        category: "street_food",
        estimated_price: "₦1,500",
        location: "Lagos (Yaba)",
        score: 94.2,
        reason: "Exact city match + budget-friendly + Haggler archetype default for street food",
      },
      {
        rank: 2,
        item: "Shawarma & Chapman Combo",
        category: "fast_food",
        estimated_price: "₦3,200",
        location: "Lagos (Lekki)",
        score: 81.5,
        reason: "Popular after-work option within budget, evening occasion match",
      },
      {
        rank: 3,
        item: "Suya + Cold Coke",
        category: "street_food",
        estimated_price: "₦2,000",
        location: "Lagos (Ikeja)",
        score: 78.9,
        reason: "Affordable, Nigerian street staple, high Haggler affinity",
      },
    ],
    location_boost_applied: true,
    cold_start_mode: true,
    diversity_score: 0.87,
  },
};

export function validatePayload(mode: Mode, raw: string): { ok: boolean; parseError?: string; missing: string[]; data?: any } {
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (e: any) {
    const msg = e?.message ?? "Invalid JSON";
    const m = /position (\d+)/.exec(msg);
    let line: number | undefined;
    if (m) {
      const pos = Number(m[1]);
      line = raw.slice(0, pos).split("\n").length;
    }
    return { ok: false, missing: [], parseError: line ? `Invalid JSON at line ${line}: ${msg}` : `Invalid JSON: ${msg}` };
  }
  const missing: string[] = [];
  const need = (path: string, val: unknown) => {
    if (val === undefined || val === null || val === "") missing.push(path);
  };
  const up = data?.user_persona ?? {};
  need("user_persona.name", up.name);
  need("user_persona.location", up.location);
  need("user_persona.archetype", up.archetype);
  need("user_persona.budget", up.budget);
  if (mode === "review") {
    const p = data?.product ?? {};
    need("product.name", p.name);
    need("product.category", p.category);
    need("product.price", p.price);
  } else {
    const c = data?.context ?? {};
    need("context.location", c.location);
    need("context.time_of_day", c.time_of_day);
    need("context.occasion", c.occasion);
  }
  return { ok: missing.length === 0, missing, data };
}
