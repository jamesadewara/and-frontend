export interface UserPersonaRecommend {
    name: string;
    location?: string;
    archetype: string;
    interests: string[];
    traits: string[];
    tone: string;
    style_sample?: string;
    nigerian_context: boolean;
    budget: number;
    price_sensitivity: string;
    past_reviews: Record<string, unknown>[];
}

export interface Context {
    location?: string;
    time_of_day?: string;
    occasion?: string;
    conversation_history: Record<string, unknown>[];
}

export interface RecommendRequest {
    user_persona: UserPersonaRecommend;
    context: Context;
}

export interface RecommendationItem {
    item_id: string;
    name: string;
    category: string;
    price_naira: number;
    rating: number;
    location: string;
    tags: string[];
    score: number;
    reason: string;
}

export interface ReasoningStepB {
    step: string;
    action: string;
    output: string;
}

export interface RecommendationResponse {
    recommendations: RecommendationItem[];
    reasoning_chain: ReasoningStepB[];
    confidence: number;
    cold_start_used: boolean;
    cross_domain: boolean;
}
