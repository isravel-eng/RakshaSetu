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
  consentNhaaAccess?: boolean;
  consentTimestamp?: string;
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

export interface NHAACaseEvent {
  id: string;
  eventId: string;
  timestamp: string;
  eventType:
    | 'CASE_REGISTERED'
    | 'HEARING_SCHEDULED'
    | 'HEARING_RESCHEDULED'
    | 'PROTECTION_ORDER_ISSUED'
    | 'INVESTIGATION_UPDATE'
    | 'MILESTONE_RECORDED';
  title: string;
  description: string;
  hearingDate?: string;
  previousHearingDate?: string;
  delayDays?: number;
  stressImpactLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  legalStage: string;
  courtOrAuthority: string;
  isNewEvent?: boolean;
}

export interface NHAACaseData {
  nhaaCaseReference: string; // e.g. "NHAA-TN-2026-00981"
  victimName: string; // e.g. "Karthik Subramanian"
  district: string; // e.g. "Chennai"
  state: string; // e.g. "Tamil Nadu"
  caseStatus: 'Active' | 'Under Investigation' | 'Trial in Progress' | 'Disposed';
  caseType: string;
  registeredDate: string;
  currentStage: string;
  nextHearingDate: string;
  lastSynchronized: string;
  policeStationOrCourt: string;
  protectionOfficer: string;
  events: NHAACaseEvent[];
  legalStressMarkers: string[];
  isConsentAuthorized: boolean;
  monitoringStatus: 'ACTIVE' | 'PAUSED' | 'REVOKED';
}

export interface RiskHistoryEntry {
  id: string;
  timestamp: string;
  score: number;
  riskLevel: RiskLevel;
  priority: TriagePriority;
  trigger: 'INITIAL_SCREENING' | 'NHAA_CASE_SYNC' | 'NHAA_EVENT_DETECTED' | 'COUNSELLOR_OVERRIDE' | 'MANUAL_REASSESSMENT';
  triggerLabel: string;
  reason: string;
  contributingFactors: string[];
  protectiveFactors: string[];
  nhaaEventRef?: string;
}

export interface CounsellorAlert {
  id: string;
  caseId: string;
  nhaaCaseReference: string;
  victimName: string;
  district: string;
  timestamp: string;
  previousScore: number;
  previousRisk: RiskLevel;
  currentScore: number;
  currentRisk: RiskLevel;
  trigger: string;
  reason: string;
  actionRequired: string;
  isAcknowledged: boolean;
  isReviewed: boolean;
  acknowledgedAt?: string;
}

export type TimelineActor = 'VICTIM' | 'NHAA_SYSTEM' | 'AI_ENGINE' | 'COUNSELLOR' | 'SYSTEM_MONITOR';

export interface CaseTimelineEvent {
  id: string;
  stage:
    | 'CONSENT_GRANTED'
    | 'NHAA_DATA_RETRIEVED'
    | 'INITIAL_RISK_ASSESSMENT'
    | 'CASE_STORED'
    | 'NHAA_EVENT_DETECTED'
    | 'RISK_REASSESSMENT'
    | 'COUNSELLOR_ALERT'
    | 'HUMAN_REVIEW'
    | 'SUPPORT_PLAN_CREATED'
    | 'FOLLOW_UP_SCHEDULED'
    | 'MONITORING_ACTIVE';
  title: string;
  description: string;
  timestamp: string;
  actor: TimelineActor;
  badgeType?: 'info' | 'warning' | 'alert' | 'success' | 'default';
}

export type SupportInterventionType =
  | 'Tele-counselling'
  | 'Tele-MANAS'
  | 'Legal support'
  | 'Medical support'
  | 'Protection'
  | 'Relocation'
  | 'Financial assistance';

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
  nhaaSignalDetected?: boolean;
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
  nhaaCaseReference: string;
  citizenName: string;
  citizenPhone: string;
  district: string;
  state: string;
  createdAt: string;
  updatedAt?: string;
  distressScore: number; // 0-100
  riskLevel: RiskLevel;
  status: CaseStatus;
  priority?: TriagePriority;
  emergencyFlag?: boolean;
  monitoringActive: boolean;
  lastSynchronized: string;
  lastEventSummary?: string;
  nhaaData?: NHAACaseData;
  riskHistory: RiskHistoryEntry[];
  alerts: CounsellorAlert[];
  timeline: CaseTimelineEvent[];
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
    selectedSupportTypes?: SupportInterventionType[];
    referralTarget?: string;
    followUpDate?: string;
    followUpTime?: string;
    actionTaken?: string;
    isHumanValidated: boolean;
    supportPlanStatus?: 'NOT_INITIATED' | 'INITIATED' | 'COMPLETED';
  };
}

export interface NationalMetrics {
  totalScreenings: number;
  criticalCases: number;
  activeCounsellors: number;
  triageTimeMinutes: number;
  monitoredNhaaCases: number;
  nhaaEventsProcessed: number;
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
  monitoredCases: number;
  nhaaAlertsToday: number;
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
  monitoredCasesCount: number;
  nhaaSyncsCount: number;
  centers: {
    name: string;
    address: string;
    phone: string;
    type: string;
    distanceKm: number;
    availableSlots: number;
  }[];
}
