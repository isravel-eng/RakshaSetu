import { CaseReviewData, CitizenProfile, ScreeningAnswers } from '../types';
import { INITIAL_CASES } from '../data/initialData';
import { readJson, storageKeys, writeJson } from './storage';
import { evaluateRisk } from './riskEngine';

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

/**
 * Builds a deterministic CaseReviewData record from screening responses
 * using the centralized AI Risk Engine.
 */
export function buildCaseFromScreening(
  profile: CitizenProfile,
  answers: ScreeningAnswers
): CaseReviewData {
  const riskResult = evaluateRisk(answers, profile);

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

  return {
    caseId: DEMO_CASE_ID,
    citizenName: profile.anonymousMode ? 'Anonymous Citizen' : profile.fullName || 'Karthik Subramanian',
    citizenPhone: profile.anonymousMode ? 'Protected Token' : profile.phone || '+91 98401 23456',
    district,
    state: profile.state || 'Tamil Nadu',
    createdAt: new Date().toISOString(),
    distressScore: riskResult.score,
    riskLevel: riskResult.riskLevel,
    status: riskResult.emergencyFlag ? 'IN_REVIEW' : 'PENDING_REVIEW',
    priority: riskResult.priority,
    emergencyFlag: riskResult.emergencyFlag,
    screeningSummary: {
      phqScore: `PHQ-4: ${phq4Estimate}/12 (${phq4Estimate >= 9 ? 'High Emotional Load' : phq4Estimate >= 6 ? 'Moderate Load' : 'Mild Load'})`,
      gadScore: `GAD-2: ${gad2Estimate}/6 (${gad2Estimate >= 4 ? 'Elevated Anxiety Indicators' : 'Manageable Anxiety'})`,
      primaryTrigger: answers.primaryStressor || 'Academic and financial pressure',
      sleepImpact: answers.sleepDisturbance || 'Sleep disruption reported',
      socialSupport: answers.socialSupportLevel || 'Limited local contacts',
      reportedSymptoms: reportedSymptoms.length > 0 ? reportedSymptoms : ['Situational mental distress and sleep fatigue']
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
      referralTarget: `Rajiv Gandhi Government General Hospital - DMHP Unit, ${district}`,
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      followUpTime: '10:30 AM IST',
      actionTaken: '',
      isHumanValidated: false
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
