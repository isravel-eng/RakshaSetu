export type ScreenId =
  | 'public-support'
  | 'screening-intro'
  | 'screening'
  | 'citizen-profile'
  | 'assessment-result'
  | 'state-dashboard'
  | 'district-dashboard'
  | 'case-review'
  | 'national-command';

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

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MILD';

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
    recommendedTier: string;
    keyRiskFactors: string[];
    protectiveFactors: string[];
    explanation: string;
    suggestedInterventions: string[];
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
