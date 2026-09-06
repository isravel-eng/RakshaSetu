import type {
  CitizenProfile,
  ScreeningAnswers,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

export interface BackendAuthResult {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    citizen_id: number | null;
  };
}

export interface BackendCase {
  id: number;
  case_number: string;
  district: string;
  state: string;
  case_stage: string;
  status: string;
  citizen_id: number;
}

export interface BackendPrediction {
  risk_level?: string;
  ml_risk_level?: string;
  class_probabilities?: Record<string, number>;
  urgent_probability?: number;
  confidence?: number;
  trend?: string;
  top_risk_factors?: string[];
  protective_factors?: string[];
  human_review_required?: boolean;
  dynamic_score?: {
    score?: number;
    risk_tier?: string;
    trend_component?: number;
    case_component?: number;
    nlp_component?: number;
  } | number;
  model_version?: string;
  disclaimer?: string;
}

export interface BackendCheckInResponse {
  check_in: Record<string, unknown>;
  ml_request: { checkin_history: unknown[] };
  prediction: BackendPrediction | null;
  stored_prediction: Record<string, unknown> | null;
  alert: Record<string, unknown> | null;
  ml_error?: { message?: string; status?: number; details?: unknown };
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
      ...(init.headers || {}),
    },
  });

  const raw = await response.text();
  let body: unknown = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = raw;
  }

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? String((body as { error?: unknown }).error)
      : `Backend request failed (${response.status})`;
    throw new Error(message);
  }

  return body as T;
}

export function getBackendBaseUrl(): string {
  return API_BASE_URL;
}

export async function registerCitizen(
  profile: CitizenProfile,
  email: string,
  password: string,
): Promise<BackendAuthResult> {
  return request<BackendAuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      role: 'citizen',
      name: profile.fullName || 'Anonymous Citizen',
      phone: profile.phone || undefined,
      district: profile.district,
      state: profile.state,
      consent_given: Boolean(profile.consentDataSharing),
    }),
  });
}

export async function loginCitizen(email: string, password: string): Promise<BackendAuthResult> {
  return request<BackendAuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function createCase(
  token: string,
  profile: CitizenProfile,
  caseStage: string = 'TRIAL',
): Promise<BackendCase> {
  const result = await request<{ case: BackendCase }>('/cases', {
    method: 'POST',
    body: JSON.stringify({
      district: profile.district || 'Chennai',
      state: profile.state || 'Tamil Nadu',
      case_stage: caseStage,
      status: 'active',
    }),
  }, token);
  return result.case;
}

function frequencyToDays(value: string): number {
  if (value.includes('Nearly every day')) return 7;
  if (value.includes('More than half')) return 5;
  if (value.includes('Several days')) return 2;
  return 0;
}

function overwhelmToScore(value: string): number {
  if (value.includes('Paralyzed')) return 10;
  if (value.includes('Severely overwhelmed') || value.includes('unable to cope')) return 8;
  if (value.includes('Struggling occasionally')) return 5;
  return 2;
}

function sleepToQuality(value: string): number {
  if (value.includes('Normal, restful')) return 9;
  if (value.includes('Intermittent')) return 6;
  if (value.includes('Severe insomnia')) return 2;
  if (value.includes('Excessive sleeping')) return 4;
  return 5;
}

function fatigueToScore(value: string): number {
  if (value.includes('Normal energy')) return 1;
  if (value.includes('Mild')) return 3;
  if (value.includes('Moderate')) return 6;
  if (value.includes('Extreme')) return 9;
  return 5;
}

function appetiteToText(value: string): string {
  if (!value || value.includes('No significant')) return 'No significant appetite change.';
  if (value.includes('Mild drop')) return 'Mild appetite reduction.';
  if (value.includes('Significant')) return 'Significant appetite reduction.';
  if (value.includes('Stress eating')) return 'Stress eating or erratic eating patterns.';
  return value;
}

function selfHarmToIndicator(value: string): number {
  const normalized = value.toLowerCase();
  if (normalized === 'immediate' || normalized === 'frequent') return 1;
  if (normalized === 'passive') return 0.5;
  return 0;
}

function buildMessage(answers: ScreeningAnswers): string {
  const parts = [
    `Emotional distress ${answers.emotionalDistress}/10.`,
    `Distress frequency: ${answers.distressFrequency}.`,
    `Coping/overwhelm: ${answers.feelingOverwhelmed}.`,
    `Sleep: ${answers.sleepDisturbance}.`,
    `Energy/fatigue: ${answers.energyFatigue}.`,
    `Appetite: ${appetiteToText(answers.appetiteChanges)}`,
    answers.primaryStressor ? `Primary stressor: ${answers.primaryStressor}.` : '',
    answers.socialSupportLevel ? `Social support: ${answers.socialSupportLevel}.` : '',
    answers.additionalNotes ? `Additional notes: ${answers.additionalNotes}.` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

export function assessmentToCheckIn(answers: ScreeningAnswers) {
  return {
    timestamp: new Date().toISOString(),
    message_text: buildMessage(answers),
    emotional_distress: Math.max(0, Math.min(10, Number(answers.emotionalDistress) || 0)),
    distress_frequency: frequencyToDays(answers.distressFrequency || ''),
    overwhelm: overwhelmToScore(answers.feelingOverwhelmed || ''),
    sleep_quality: sleepToQuality(answers.sleepDisturbance || ''),
    fatigue: fatigueToScore(answers.energyFatigue || ''),
    social_support: socialSupportToScore(answers.socialSupportLevel || ''),
    coping_ability: copingToScore(answers.copingAbility || answers.feelingOverwhelmed || ''),
    self_harm_indicator: selfHarmToIndicator(answers.selfHarmThoughts || 'none'),
  };
}

function socialSupportToScore(value: string): number {
  if (value.includes('Strong')) return 9;
  if (value.includes('Moderate')) return 6;
  if (value.includes('Minimal')) return 3;
  if (value.includes('Completely isolated')) return 0;
  return 5;
}

function copingToScore(value: string): number {
  if (value.includes('well') || value.includes('Fair')) return 7;
  if (value.includes('Struggling')) return 5;
  if (value.includes('unable') || value.includes('Unable')) return 2;
  return 5;
}

export async function submitAssessment(
  token: string,
  caseId: number,
  answers: ScreeningAnswers,
): Promise<BackendCheckInResponse> {
  const checkIn = assessmentToCheckIn(answers);
  return request<BackendCheckInResponse>('/check-ins', {
    method: 'POST',
    body: JSON.stringify({
      case_id: caseId,
      ...checkIn,
    }),
  }, token);
}

export function predictionToRiskResult(
  prediction: BackendPrediction | null,
  fallbackDisclaimer = 'Synthetic demonstration only; not a diagnosis or clinical recommendation.'
) {
  if (!prediction) return null;
  const score = typeof prediction.dynamic_score === 'number'
    ? prediction.dynamic_score
    : prediction.dynamic_score?.score ?? 0;
  const tier = prediction.risk_level || prediction.dynamic_score?.risk_tier || 'LOW';
  const normalizedRisk = tier === 'MEDIUM' ? 'MODERATE' : tier;
  const confidenceScore = Math.round((prediction.confidence ?? 0) * 100);
  return {
    riskLevel: normalizedRisk,
    score: Math.round(score),
    confidence: confidenceScore >= 80 ? 'HIGH' : confidenceScore >= 55 ? 'MEDIUM' : 'LOW',
    confidenceScore,
    priority: normalizedRisk === 'URGENT' ? 'IMMEDIATE' : normalizedRisk === 'HIGH' ? 'URGENT' : normalizedRisk === 'MODERATE' ? 'PRIORITY' : 'ROUTINE',
    contributingFactors: prediction.top_risk_factors || [],
    protectiveFactors: prediction.protective_factors || [],
    requiresHumanReview: Boolean(prediction.human_review_required),
    emergencyFlag: normalizedRisk === 'URGENT',
    recommendedTier: normalizedRisk === 'URGENT'
      ? 'Tier-1: Emergency Human Intervention'
      : normalizedRisk === 'HIGH'
        ? 'Tier-3: Immediate Specialist Intervention & Follow-up'
        : normalizedRisk === 'MODERATE'
          ? 'Tier-2: Guided Counselling & Self-Care Toolkit'
          : 'Tier-4: Psychoeducation & Community Resources',
    distressCategory: normalizedRisk === 'URGENT'
      ? 'Urgent Distress Signal'
      : normalizedRisk === 'HIGH'
        ? 'High Distress Signal'
        : normalizedRisk === 'MODERATE'
          ? 'Moderate Situational Distress'
          : 'Low Distress Signal',
    recommendedAction: Boolean(prediction.human_review_required)
      ? 'Human counsellor review is required for this preliminary screening result.'
      : 'Continue routine support and monitoring.',
    explanation: `ML service result: ${prediction.ml_risk_level || normalizedRisk}. Trend: ${prediction.trend || 'stable/improving'}.`,
    suggestedInterventions: [],
    disclaimer: prediction.disclaimer || fallbackDisclaimer,
    nhaaSignalDetected: false,
  };
}
