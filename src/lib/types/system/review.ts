export interface Review {
    product_name: string;
    rating: number;
    text: string;
    date: string;
}

export interface UserPersonaReview {
    name: string;
    interests: string[];
    traits: string[];
    tone: string;
    style_sample: string;
    nigerian_context: boolean;
    past_reviews: Review[];
    budget: number;
    archetype: string;
    price_sensitivity: string;
}

export interface ProductDetails {
    name: string;
    category: string;
    description?: string;
    image_url?: string;
    price: number;
}

export interface ReviewGenerateRequest {
    user_persona: UserPersonaReview;
    product: ProductDetails;
}

export interface StyleSnapshot {
    inferred_tone: string;
    inferred_archetype: string;
    applied_markers: string[];
    adaptation_reason: string;
}

export interface ReasoningStep {
    step: string;
    action: string;
    output: string;
}

export interface ReviewResponse {
    review_text: string;
    predicted_rating: number;
    reasoning_chain: ReasoningStep[];
    confidence: number;
    style_snapshot: StyleSnapshot;
    image_url?: string;
    used_nigerian_markers: string[];
    sentence_count: number;
}
