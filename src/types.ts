export type ScreenId =
  | 'public-support'
  | 'citizen-login'
  | 'citizen-consent'
  | 'screening-intro'
  | 'screening'
  | 'screening-review'
  | 'citizen-profile'
  | 'assessment-result'
  | 'state-dashboard'
  | 'district-dashboard'
  | 'case-review'
  | 'national-command';

export interface CitizenSession {
  phone: string;
  displayName: string;
  loggedInAt: string;
}

export type UserRole =
  | 'citizen'
  | 'counsellor'
  | 'district_officer'
  | 'state_officer'
  | 'national_admin';

export type TransitionType = 'push' | 'push_back' | 'slide_up' | 'none';

export interface CitizenProfile {
  fullName: string;
  phone: string;
  district: string;
  state: string;
  preferredLanguage: string;
  gender: string;
  ageGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  consentDataSharing: boolean;
  anonymousMode: boolean;
}

export interface ScreeningAnswers {
  emotionalDistress: number; // 0-10
  distressFrequency: string;
  feelingOverwhelmed: string;
  sleepDisturbance: string;
  energyFatigue: string;
  appetiteChanges: string;
  primaryStressor: string;
  secondaryStressors: string[];
  socialSupportLevel: string;
  selfHarmThoughts: string; // 'none' | 'passive' | 'frequent' | 'immediate'
  copingAbility: string;
  additionalNotes: string;
  voiceNoteRecorded: boolean;
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'MILD';

export type TriagePriority = 'ROUTINE' | 'PRIORITY' | 'URGENT' | 'IMMEDIATE';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssessmentResult {
  riskLevel: RiskLevel;
  score: number; // 0-100
  confidence: ConfidenceLevel;
  confidenceScore: number;
  priority: TriagePriority;
  contributingFactors: string[];
  protectiveFactors: string[];
  recommendedAction: string;
  explanation: string;
  requiresHumanReview: boolean;
  emergencyFlag: boolean;
  recommendedTier: string;
  distressCategory: string;
  suggestedInterventions: string[];
  disclaimer: string;
}

export type CaseStatus =
  | 'PENDING_REVIEW'
  | 'IN_REVIEW'
  | 'REFERRED'
  | 'FOLLOW_UP_SCHEDULED'
  | 'RESOLVED'
  | 'ESCALATED';

export interface CaseReviewData {
  caseId: string;
  citizenName: string;
  citizenPhone: string;
  district: string;
  state: string;
  createdAt: string;
  distressScore: number; // 0-100
  riskLevel: RiskLevel;
  status: CaseStatus;
  priority?: TriagePriority;
  emergencyFlag?: boolean;
  screeningSummary: {
    phqScore: string;
    gadScore: string;
    primaryTrigger: string;
    sleepImpact: string;
    socialSupport: string;
    reportedSymptoms: string[];
  };
  aiAssessment: {
    distressCategory: string;
    confidenceScore: number;
    confidenceLevel?: ConfidenceLevel;
    priority?: TriagePriority;
    emergencyFlag?: boolean;
    recommendedTier: string;
    recommendedAction?: string;
    keyRiskFactors: string[];
    protectiveFactors: string[];
    explanation: string;
    suggestedInterventions: string[];
    requiresHumanReview?: boolean;
    disclaimer?: string;
  };
  counsellorReview: {
    assignedCounsellor: string;
    counsellorId: string;
    reviewedAt?: string;
    clinicalNotes: string;
    humanValidatedRisk: RiskLevel;
    interventionPlan: string[];
    referralTarget?: string;
    followUpDate?: string;
    followUpTime?: string;
    actionTaken?: string;
    isHumanValidated: boolean;
  };
}

export interface NationalMetrics {
  totalScreenings: number;
  criticalCases: number;
  activeCounsellors: number;
  triageTimeMinutes: number;
  stateBreakdown: {
    state: string;
    cases: number;
    highRisk: number;
    capacity: number;
    status: 'OPTIMAL' | 'MODERATE' | 'STRAINED' | 'CRITICAL';
  }[];
  trendData: {
    time: string;
    screenings: number;
    criticalAlerts: number;
  }[];
}

export interface StateMetrics {
  stateName: string;
  totalCases: number;
  pendingValidation: number;
  activeFollowUps: number;
  resolvedThisMonth: number;
  districtStats: {
    district: string;
    cases: number;
    riskScoreAvg: number;
    counsellorsOnline: number;
    status: string;
  }[];
}

export interface DistrictMetrics {
  districtName: string;
  stateName: string;
  activeQueue: number;
  criticalAlerts: number;
  counsellorsAvailable: number;
  avgResponseMins: number;
  centers: {
    name: string;
    address: string;
    phone: string;
    type: string;
    distanceKm: number;
    availableSlots: number;
  }[];
}
