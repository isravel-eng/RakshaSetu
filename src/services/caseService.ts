import {
  CaseReviewData,
  CitizenProfile,
  CounsellorAlert,
  NHAACaseData,
  RiskLevel,
  ScreeningAnswers,
  SupportInterventionType
} from '../types';
import { INITIAL_CASES } from '../data/initialData';
import { readJson, storageKeys, writeJson } from './storage';
import { evaluateRisk } from './riskEngine';
import { DEFAULT_NHAA_CASE_REF, getConsentedCaseData, loadNhaaData } from './nhaaService';

const DEMO_CASE_ID = 'RS-2026-00124';

export function loadCases(): CaseReviewData[] {
  const stored = readJson<CaseReviewData[]>(storageKeys.cases);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    return INITIAL_CASES;
  }
  return stored;
}

export function persistCases(cases: CaseReviewData[]): void {
  writeJson(storageKeys.cases, cases);
}

export function loadCitizenProfile(fallback: CitizenProfile): CitizenProfile {
  return readJson<CitizenProfile>(storageKeys.profile) ?? fallback;
}

export function persistCitizenProfile(profile: CitizenProfile): void {
  writeJson(storageKeys.profile, profile);
}

export function loadScreeningAnswers(fallback: ScreeningAnswers): ScreeningAnswers {
  return readJson<ScreeningAnswers>(storageKeys.screening) ?? fallback;
}

export function persistScreeningAnswers(answers: ScreeningAnswers): void {
  writeJson(storageKeys.screening, answers);
}

export function loadCounsellorAlerts(): CounsellorAlert[] {
  const stored = readJson<CounsellorAlert[]>(storageKeys.alerts);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  return [];
}

export function persistCounsellorAlerts(alerts: CounsellorAlert[]): void {
  writeJson(storageKeys.alerts, alerts);
}

/**
 * Builds a deterministic CaseReviewData record from screening responses + NHAA case context.
 */
export function buildCaseFromScreening(
  profile: CitizenProfile,
  answers: ScreeningAnswers,
  nhaaData?: NHAACaseData | null
): CaseReviewData {
  const activeNhaa = nhaaData || loadNhaaData();
  const riskResult = evaluateRisk(answers, profile, activeNhaa);

  const reportedSymptoms: string[] = [];
  if (answers.feelingOverwhelmed) reportedSymptoms.push(answers.feelingOverwhelmed);
  if (answers.sleepDisturbance) reportedSymptoms.push(answers.sleepDisturbance);
  if (answers.energyFatigue) reportedSymptoms.push(answers.energyFatigue);
  if (answers.additionalNotes && answers.additionalNotes.trim()) {
    reportedSymptoms.push(answers.additionalNotes.trim());
  }

  const district = profile.district || 'Chennai';
  const phq4Estimate = Math.min(12, Math.round((riskResult.score / 100) * 12));
  const gad2Estimate = Math.min(6, Math.round((riskResult.score / 100) * 6));
  const nowIso = new Date().toISOString();

  return {
    caseId: DEMO_CASE_ID,
    nhaaCaseReference: activeNhaa.nhaaCaseReference || DEFAULT_NHAA_CASE_REF,
    citizenName: profile.anonymousMode ? 'Anonymous Citizen' : profile.fullName || 'Karthik Subramanian',
    citizenPhone: profile.anonymousMode ? 'Protected Token' : profile.phone || '+91 98401 23456',
    district,
    state: profile.state || 'Tamil Nadu',
    createdAt: nowIso,
    updatedAt: nowIso,
    distressScore: riskResult.score,
    riskLevel: riskResult.riskLevel,
    status: riskResult.emergencyFlag ? 'IN_REVIEW' : 'PENDING_REVIEW',
    priority: riskResult.priority,
    emergencyFlag: riskResult.emergencyFlag,
    monitoringActive: true,
    lastSynchronized: nowIso,
    lastEventSummary: 'Initial Hearing Scheduled for 04 Sep 2026',
    nhaaData: activeNhaa,
    riskHistory: [
      {
        id: `RH-${Date.now()}`,
        timestamp: nowIso,
        score: riskResult.score,
        riskLevel: riskResult.riskLevel,
        priority: riskResult.priority,
        trigger: 'INITIAL_SCREENING',
        triggerLabel: 'Initial Intake Screening + NHAA Case Sync',
        reason: 'Baseline intake screening combined with active court hearing notice on 04 Sep 2026.',
        contributingFactors: riskResult.contributingFactors,
        protectiveFactors: riskResult.protectiveFactors,
        nhaaEventRef: 'EVT-002'
      }
    ],
    alerts: [],
    timeline: [
      {
        id: `TL-${Date.now()}-1`,
        stage: 'CONSENT_GRANTED',
        title: 'Consent Granted by Victim',
        description: `${profile.fullName || 'Karthik Subramanian'} authorized RakshaSetu to access permitted NHAA case information for continuous monitoring and support.`,
        timestamp: nowIso,
        actor: 'VICTIM',
        badgeType: 'success'
      },
      {
        id: `TL-${Date.now()}-2`,
        stage: 'NHAA_DATA_RETRIEVED',
        title: 'NHAA Case Data Authorized & Retrieved',
        description: `Permitted case record (${activeNhaa.nhaaCaseReference}) synchronized from Integrated NHAA Registry. Next hearing: ${activeNhaa.nextHearingDate}.`,
        timestamp: nowIso,
        actor: 'NHAA_SYSTEM',
        badgeType: 'info'
      },
      {
        id: `TL-${Date.now()}-3`,
        stage: 'INITIAL_RISK_ASSESSMENT',
        title: `Initial AI Risk Evaluation: ${riskResult.score}/100 (${riskResult.riskLevel})`,
        description: 'Combined psychological self-report + NHAA case context evaluated.',
        timestamp: nowIso,
        actor: 'AI_ENGINE',
        badgeType: 'warning'
      },
      {
        id: `TL-${Date.now()}-4`,
        stage: 'CASE_STORED',
        title: 'Case Record Stored & Continuous Monitoring Active',
        description: `Case ${DEMO_CASE_ID} registered under continuous automated event monitoring.`,
        timestamp: nowIso,
        actor: 'SYSTEM_MONITOR',
        badgeType: 'info'
      }
    ],
    screeningSummary: {
      phqScore: `PHQ-4: ${phq4Estimate}/12 (${phq4Estimate >= 9 ? 'High Emotional Load' : phq4Estimate >= 6 ? 'Moderate Load' : 'Mild Load'})`,
      gadScore: `GAD-2: ${gad2Estimate}/6 (${gad2Estimate >= 4 ? 'Elevated Anxiety Indicators' : 'Manageable Anxiety'})`,
      primaryTrigger: answers.primaryStressor || 'Sub judice court deposition and sleep disruption',
      sleepImpact: answers.sleepDisturbance || '5-6 hours light sleep with awakenings',
      socialSupport: answers.socialSupportLevel || 'Limited local contacts',
      reportedSymptoms: reportedSymptoms.length > 0 ? reportedSymptoms : ['Situational anxiety and sleep fatigue']
    },
    aiAssessment: {
      distressCategory: riskResult.distressCategory,
      confidenceScore: riskResult.confidenceScore,
      confidenceLevel: riskResult.confidence,
      priority: riskResult.priority,
      emergencyFlag: riskResult.emergencyFlag,
      recommendedTier: riskResult.recommendedTier,
      recommendedAction: riskResult.recommendedAction,
      keyRiskFactors: riskResult.contributingFactors,
      protectiveFactors: riskResult.protectiveFactors,
      explanation: riskResult.explanation,
      suggestedInterventions: riskResult.suggestedInterventions,
      requiresHumanReview: riskResult.requiresHumanReview,
      disclaimer: riskResult.disclaimer
    },
    counsellorReview: {
      assignedCounsellor: 'Dr. Priya Raman (Lead Clinical Psychologist, DMHP)',
      counsellorId: 'TN-PSY-8492',
      reviewedAt: undefined,
      clinicalNotes: '',
      humanValidatedRisk: riskResult.riskLevel,
      interventionPlan: riskResult.suggestedInterventions.slice(0, 3),
      selectedSupportTypes: ['Tele-counselling', 'Tele-MANAS'],
      referralTarget: `Rajiv Gandhi Government General Hospital - DMHP Unit, ${district}`,
      followUpDate: '2026-09-03',
      followUpTime: '10:30 AM IST',
      actionTaken: '',
      isHumanValidated: false,
      supportPlanStatus: 'NOT_INITIATED'
    }
  };
}

export function upsertSubmittedCase(
  existing: CaseReviewData[],
  submitted: CaseReviewData
): CaseReviewData[] {
  const next = [submitted, ...existing.filter((c) => c.caseId !== submitted.caseId)];
  persistCases(next);
  return next;
}

/**
 * Re-evaluates case risk when an incoming NHAA case update or event is detected.
 */
export function reprocessCaseOnNhaaUpdate(
  caseId: string,
  updatedNhaaData: NHAACaseData,
  profile?: CitizenProfile,
  answers?: ScreeningAnswers
): { updatedCase: CaseReviewData; newAlert: CounsellorAlert } {
  const allCases = loadCases();
  const currentCase = allCases.find((c) => c.caseId === caseId) || INITIAL_CASES[0];
  const activeProfile = profile || loadCitizenProfile({
    fullName: currentCase.citizenName,
    phone: currentCase.citizenPhone,
    district: currentCase.district,
    state: currentCase.state,
    preferredLanguage: 'English',
    gender: 'Male',
    ageGroup: '25-34',
    emergencyContactName: 'R. Subramanian',
    emergencyContactPhone: '+91 94441 98765',
    consentDataSharing: true,
    consentNhaaAccess: true,
    anonymousMode: false
  });
  const activeAnswers = answers || loadScreeningAnswers({
    emotionalDistress: 6,
    distressFrequency: 'Several days (1-3 days/week)',
    feelingOverwhelmed: 'Struggling occasionally but functioning',
    sleepDisturbance: 'Intermittent awakenings / 5-6 hours light sleep',
    energyFatigue: 'Moderate physical exhaustion',
    appetiteChanges: 'Mild drop in appetite',
    primaryStressor: 'Court hearing and legal uncertainty',
    secondaryStressors: ['Work pressure', 'Sleep disruption'],
    socialSupportLevel: 'Moderate support (family present but hesitant to open up)',
    selfHarmThoughts: 'none',
    copingAbility: 'Fair with occasional difficulty',
    additionalNotes: 'Hearing schedule change causing increased anxiety.',
    voiceNoteRecorded: false
  });

  const previousScore = currentCase.distressScore;
  const previousRisk = currentCase.riskLevel;

  // Run AI Risk Engine with updated NHAA data
  const newRiskResult = evaluateRisk(activeAnswers, activeProfile, updatedNhaaData);
  const nowIso = new Date().toISOString();

  // Create new Risk History Entry
  const newRiskEntry = {
    id: `RH-${Date.now()}`,
    timestamp: nowIso,
    score: newRiskResult.score,
    riskLevel: newRiskResult.riskLevel,
    priority: newRiskResult.priority,
    trigger: 'NHAA_EVENT_DETECTED' as const,
    triggerLabel: 'NHAA Event: Hearing Rescheduled (14-Day Judicial Delay)',
    reason: `Judicial delay detected on NHAA registry (Hearing postponed from 04 Sep to 18 Sep 2026). Risk score increased from ${previousScore} (${previousRisk}) to ${newRiskResult.score} (${newRiskResult.riskLevel}).`,
    contributingFactors: newRiskResult.contributingFactors,
    protectiveFactors: newRiskResult.protectiveFactors,
    nhaaEventRef: 'EVT-003'
  };

  // Create Counsellor Alert
  const newAlert: CounsellorAlert = {
    id: `ALT-${Date.now()}`,
    caseId: currentCase.caseId,
    nhaaCaseReference: updatedNhaaData.nhaaCaseReference,
    victimName: currentCase.citizenName,
    district: currentCase.district,
    timestamp: nowIso,
    previousScore,
    previousRisk,
    currentScore: newRiskResult.score,
    currentRisk: newRiskResult.riskLevel,
    trigger: 'NHAA Case Event Detected: Hearing Rescheduled',
    reason: 'Updated case information from NHAA registry changed the distress-risk assessment from MODERATE to HIGH.',
    actionRequired: 'Human counsellor review required. Tele-counselling outreach indicated.',
    isAcknowledged: false,
    isReviewed: false
  };

  // Timeline entries for re-assessment
  const newTimelineEvents = [
    {
      id: `TL-${Date.now()}-1`,
      stage: 'NHAA_EVENT_DETECTED' as const,
      title: 'NHAA Case Event Detected: Hearing Postponed',
      description: 'NHAA Monitor captured judicial notice: Hearing date postponed from 04 Sep 2026 to 18 Sep 2026 (14-day delay).',
      timestamp: nowIso,
      actor: 'NHAA_SYSTEM' as const,
      badgeType: 'alert' as const
    },
    {
      id: `TL-${Date.now()}-2`,
      stage: 'RISK_REASSESSMENT' as const,
      title: `Risk Reassessment Completed: ${newRiskResult.score}/100 (${newRiskResult.riskLevel})`,
      description: `AI Risk Engine re-evaluated distress context. Score escalated from ${previousScore} to ${newRiskResult.score}.`,
      timestamp: nowIso,
      actor: 'AI_ENGINE' as const,
      badgeType: 'alert' as const
    },
    {
      id: `TL-${Date.now()}-3`,
      stage: 'COUNSELLOR_ALERT' as const,
      title: 'High-Risk Counsellor Alert Dispatched to Tele-MANAS',
      description: 'Priority clinical notification sent to Tele-MANAS triage queue for mandatory human validation.',
      timestamp: nowIso,
      actor: 'SYSTEM_MONITOR' as const,
      badgeType: 'alert' as const
    }
  ];

  const updatedCase: CaseReviewData = {
    ...currentCase,
    updatedAt: nowIso,
    distressScore: newRiskResult.score,
    riskLevel: newRiskResult.riskLevel,
    priority: newRiskResult.priority,
    status: 'PENDING_REVIEW',
    lastSynchronized: nowIso,
    lastEventSummary: 'Hearing Postponed to 18 Sep 2026 (14-day delay)',
    nhaaData: updatedNhaaData,
    riskHistory: [newRiskEntry, ...currentCase.riskHistory],
    alerts: [newAlert, ...currentCase.alerts],
    timeline: [...newTimelineEvents, ...currentCase.timeline],
    aiAssessment: {
      distressCategory: newRiskResult.distressCategory,
      confidenceScore: newRiskResult.confidenceScore,
      confidenceLevel: newRiskResult.confidence,
      priority: newRiskResult.priority,
      emergencyFlag: newRiskResult.emergencyFlag,
      recommendedTier: newRiskResult.recommendedTier,
      recommendedAction: newRiskResult.recommendedAction,
      keyRiskFactors: newRiskResult.contributingFactors,
      protectiveFactors: newRiskResult.protectiveFactors,
      explanation: newRiskResult.explanation,
      suggestedInterventions: newRiskResult.suggestedInterventions,
      requiresHumanReview: true,
      disclaimer: newRiskResult.disclaimer
    }
  };

  const updatedCases = upsertSubmittedCase(allCases, updatedCase);
  persistCases(updatedCases);

  const existingAlerts = loadCounsellorAlerts();
  persistCounsellorAlerts([newAlert, ...existingAlerts.filter((a) => a.id !== newAlert.id)]);

  return { updatedCase, newAlert };
}

/**
 * Validates case by human Tele-MANAS counsellor with intervention plan and follow-up.
 */
export function validateCaseByCounsellor(
  caseId: string,
  validation: {
    humanValidatedRisk: RiskLevel;
    clinicalNotes: string;
    selectedSupportTypes: SupportInterventionType[];
    referralTarget: string;
    followUpDate: string;
    followUpTime: string;
  }
): CaseReviewData {
  const allCases = loadCases();
  const current = allCases.find((c) => c.caseId === caseId) || INITIAL_CASES[0];
  const nowIso = new Date().toISOString();

  const humanValidationTimeline = [
    {
      id: `TL-${Date.now()}-1`,
      stage: 'HUMAN_REVIEW' as const,
      title: `Human Clinical Review Completed: ${validation.humanValidatedRisk}`,
      description: `Dr. Priya Raman reviewed AI preliminary assessment. Validated risk level: ${validation.humanValidatedRisk}. Clinical notes recorded.`,
      timestamp: nowIso,
      actor: 'COUNSELLOR' as const,
      badgeType: 'success' as const
    },
    {
      id: `TL-${Date.now()}-2`,
      stage: 'SUPPORT_PLAN_CREATED' as const,
      title: 'Support & Intervention Plan Authorized',
      description: `Prescribed Interventions: ${validation.selectedSupportTypes.join(', ')}. Referral Target: ${validation.referralTarget}.`,
      timestamp: nowIso,
      actor: 'COUNSELLOR' as const,
      badgeType: 'success' as const
    },
    {
      id: `TL-${Date.now()}-3`,
      stage: 'FOLLOW_UP_SCHEDULED' as const,
      title: `Follow-up Scheduled: ${validation.followUpDate} at ${validation.followUpTime}`,
      description: 'Tele-MANAS clinical check-in confirmed on calendar.',
      timestamp: nowIso,
      actor: 'COUNSELLOR' as const,
      badgeType: 'info' as const
    }
  ];

  const updatedCase: CaseReviewData = {
    ...current,
    status: 'FOLLOW_UP_SCHEDULED',
    updatedAt: nowIso,
    counsellorReview: {
      ...current.counsellorReview,
      reviewedAt: nowIso,
      humanValidatedRisk: validation.humanValidatedRisk,
      clinicalNotes: validation.clinicalNotes,
      selectedSupportTypes: validation.selectedSupportTypes,
      referralTarget: validation.referralTarget,
      followUpDate: validation.followUpDate,
      followUpTime: validation.followUpTime,
      isHumanValidated: true,
      supportPlanStatus: 'INITIATED',
      actionTaken: `Support initiated: ${validation.selectedSupportTypes.join(', ')}. Follow-up scheduled for ${validation.followUpDate} at ${validation.followUpTime}.`
    },
    alerts: current.alerts.map((a) => ({ ...a, isReviewed: true })),
    timeline: [...humanValidationTimeline, ...current.timeline]
  };

  const updatedCases = upsertSubmittedCase(allCases, updatedCase);
  persistCases(updatedCases);

  const existingAlerts = loadCounsellorAlerts();
  persistCounsellorAlerts(
    existingAlerts.map((a) => (a.caseId === caseId ? { ...a, isReviewed: true } : a))
  );

  return updatedCase;
}
