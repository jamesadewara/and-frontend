/**
 * Shared API response and request types
 */

export interface ReasoningStep {
  step: string;
  action: string;
  output: string;
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

export interface Review {
  product_name: string;
  rating: number;
  text: string;
  date: string;
}

export interface ProductDetails {
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  price: number;
}

export interface StyleSnapshot {
  inferred_tone: string;
  inferred_archetype: string;
  applied_markers: string[];
  adaptation_reason: string;
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

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  reasoning_chain: ReasoningStep[];
  confidence: number;
  cold_start_used: boolean;
  cross_domain: boolean;
}

export interface SSEMessage<T> {
  event: 'reasoning' | 'final_result' | 'error';
  data: T;
}

export interface ErrorResponse {
  detail: string;
}
