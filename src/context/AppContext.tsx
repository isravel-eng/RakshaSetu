import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenId,
  UserRole,
  TransitionType,
  CitizenProfile,
  ScreeningAnswers,
  CaseReviewData,
  RiskLevel
} from '../types';
import {
  INITIAL_CASES,
  DEMO_CASE_RS_2026_00124
} from '../data/initialData';

interface AppContextType {
  currentScreen: ScreenId;
  transitionType: TransitionType;
  screenHistory: ScreenId[];
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  navigateBack: () => void;
  citizenProfile: CitizenProfile;
  updateCitizenProfile: (updates: Partial<CitizenProfile>) => void;
  screeningAnswers: ScreeningAnswers;
  updateScreeningAnswers: (updates: Partial<ScreeningAnswers>) => void;
  cases: CaseReviewData[];
  currentCaseId: string;
  currentCase: CaseReviewData;
  setCurrentCaseId: (id: string) => void;
  updateCase: (caseId: string, updates: Partial<CaseReviewData>) => void;
  validateCaseByCounsellor: (
    caseId: string,
    validationData: Partial<CaseReviewData['counsellorReview']> & { newStatus?: CaseReviewData['status'] }
  ) => void;
  submitScreening: () => CaseReviewData;
  resetToDefault: () => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: CitizenProfile = {
  fullName: 'Karthik Subramanian',
  phone: '+91 98401 23456',
  district: 'Chennai',
  state: 'Tamil Nadu',
  preferredLanguage: 'English / தமிழ் (Tamil)',
  gender: 'Male',
  ageGroup: '25-34',
  emergencyContactName: 'Ramesh Subramanian (Brother)',
  emergencyContactPhone: '+91 98401 99887',
  consentDataSharing: true,
  anonymousMode: false
};

const DEFAULT_SCREENING: ScreeningAnswers = {
  emotionalDistress: 8,
  distressFrequency: 'Nearly every day (Past 2+ weeks)',
  feelingOverwhelmed: 'Severely overwhelmed, unable to cope with daily tasks',
  sleepDisturbance: 'Severe insomnia (< 3 hours erratic sleep nightly)',
  energyFatigue: 'Extreme fatigue and brain fog throughout the day',
  appetiteChanges: 'Significant reduction in food intake',
  primaryStressor: 'Acute financial pressure and career uncertainty',
  secondaryStressors: ['Family expectations', 'Social isolation', 'Lack of rest'],
  socialSupportLevel: 'Minimal / living alone in Chennai',
  selfHarmThoughts: 'passive',
  copingAbility: 'Struggling significantly without external support',
  additionalNotes: 'Feeling continuously drained, racing thoughts during nights, hard to focus on work.',
  voiceNoteRecorded: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('public-support');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['public-support']);
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);

  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(DEFAULT_PROFILE);
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswers>(DEFAULT_SCREENING);
  const [cases, setCases] = useState<CaseReviewData[]>(INITIAL_CASES);
  const [currentCaseId, setCurrentCaseId] = useState<string>('RS-2026-00124');

  const updateCitizenProfile = (updates: Partial<CitizenProfile>) => {
    setCitizenProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateScreeningAnswers = (updates: Partial<ScreeningAnswers>) => {
    setScreeningAnswers((prev) => ({ ...prev, ...updates }));
  };

  const navigateTo = (screen: ScreenId, transition: TransitionType = 'push') => {
    setTransitionType(transition);
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 1) {
      setTransitionType('push_back');
      const newHistory = [...screenHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      setTransitionType('push_back');
      setCurrentScreen('public-support');
    }
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    // Role based default screen recommendations
    if (role === 'citizen') {
      navigateTo('public-support', 'none');
    } else if (role === 'counsellor') {
      navigateTo('case-review', 'slide_up');
    } else if (role === 'district_officer') {
      navigateTo('district-dashboard', 'slide_up');
    } else if (role === 'state_officer') {
      navigateTo('state-dashboard', 'slide_up');
    } else if (role === 'national_admin') {
      navigateTo('national-command', 'slide_up');
    }
  };

  const updateCase = (caseId: string, updates: Partial<CaseReviewData>) => {
    setCases((prev) =>
      prev.map((c) => (c.caseId === caseId ? { ...c, ...updates } : c))
    );
  };

  const validateCaseByCounsellor = (
    caseId: string,
    validationData: Partial<CaseReviewData['counsellorReview']> & { newStatus?: CaseReviewData['status'] }
  ) => {
    const { newStatus, ...counsellorFields } = validationData;
    setCases((prev) =>
      prev.map((c) => {
        if (c.caseId === caseId) {
          return {
            ...c,
            status: newStatus || 'FOLLOW_UP_SCHEDULED',
            counsellorReview: {
              ...c.counsellorReview,
              ...counsellorFields,
              reviewedAt: new Date().toISOString(),
              isHumanValidated: true
            }
          };
        }
        return c;
      })
    );
  };

  const submitScreening = (): CaseReviewData => {
    // Generate deterministic / calculated score
    const baseScore = Math.min(
      98,
      Math.max(
        20,
        screeningAnswers.emotionalDistress * 6 +
          (screeningAnswers.selfHarmThoughts === 'immediate'
            ? 35
            : screeningAnswers.selfHarmThoughts === 'frequent'
            ? 25
            : screeningAnswers.selfHarmThoughts === 'passive'
            ? 15
            : 0) +
          (screeningAnswers.sleepDisturbance.includes('insomnia') ? 12 : 5)
      )
    );

    let riskLevel: RiskLevel = 'MILD';
    if (baseScore >= 75) riskLevel = 'HIGH';
    else if (baseScore >= 50) riskLevel = 'MODERATE';
    if (screeningAnswers.selfHarmThoughts === 'immediate' || baseScore >= 88) {
      riskLevel = 'CRITICAL';
    }

    const generatedCaseId = 'RS-2026-00124'; // Deterministic demonstration case requested

    const newCase: CaseReviewData = {
      caseId: generatedCaseId,
      citizenName: citizenProfile.anonymousMode ? 'Anonymous Citizen' : citizenProfile.fullName || 'Karthik Subramanian',
      citizenPhone: citizenProfile.anonymousMode ? 'Protected Token' : citizenProfile.phone || '+91 98401 23456',
      district: citizenProfile.district || 'Chennai',
      state: citizenProfile.state || 'Tamil Nadu',
      createdAt: new Date().toISOString(),
      distressScore: baseScore || 78,
      riskLevel,
      status: 'PENDING_REVIEW',
      screeningSummary: {
        phqScore: `PHQ-4: ${Math.round((baseScore / 100) * 12)}/12`,
        gadScore: `GAD-2: ${Math.round((baseScore / 100) * 6)}/6`,
        primaryTrigger: screeningAnswers.primaryStressor || 'Academic and financial pressure',
        sleepImpact: screeningAnswers.sleepDisturbance || '< 3 hours sleep per night',
        socialSupport: screeningAnswers.socialSupportLevel || 'Limited local contacts',
        reportedSymptoms: [
          'Acute mental distress and sleep fatigue',
          'Feeling overwhelmed with daily responsibilities',
          screeningAnswers.additionalNotes || 'Cognitive exhaustion'
        ]
      },
      aiAssessment: {
        distressCategory:
          riskLevel === 'CRITICAL'
            ? 'Critical Acute Crisis'
            : riskLevel === 'HIGH'
            ? 'High Acute Distress with Anxiety Complex'
            : riskLevel === 'MODERATE'
            ? 'Moderate Situational Distress'
            : 'Mild Situational Stress',
        confidenceScore: 92,
        recommendedTier:
          riskLevel === 'CRITICAL'
            ? 'Tier-1: Emergency Human Intervention & Physical Dispatch'
            : riskLevel === 'HIGH'
            ? 'Tier-3: Immediate Specialist Intervention & Follow-up'
            : riskLevel === 'MODERATE'
            ? 'Tier-2: Guided Counselling & Self-Care Toolkit'
            : 'Tier-4: Psychoeducation & Community Resources',
        keyRiskFactors: [
          `Distress severity score (${baseScore}/100) requires clinical attention`,
          'Sleep disruption compounding anxiety symptoms',
          'Multiple environmental stressors identified'
        ],
        protectiveFactors: [
          'Voluntary screening completion and willingness to engage',
          'Supportive emergency contact registered',
          'Receptive to tele-counselling'
        ],
        explanation:
          'The screening responses indicate severe cumulative distress triggered by multiple converging environmental stressors. The combination of chronic sleep disruption and high situational anxiety warrants urgent human clinical triage.',
        suggestedInterventions: [
          'Immediate Tele-MANAS / Clinical Psychologist Tele-consultation within 2 hours',
          `Scheduled consultation at District Mental Health Centre, ${citizenProfile.district || 'Chennai'}`,
          'Structured sleep hygiene and anxiety regulation toolkit',
          'Mandatory 48-hour follow-up check-in'
        ]
      },
      counsellorReview: {
        assignedCounsellor: 'Dr. Priya Raman (Lead Clinical Psychologist, DMHP)',
        counsellorId: 'TN-PSY-8492',
        reviewedAt: undefined,
        clinicalNotes: '',
        humanValidatedRisk: riskLevel,
        interventionPlan: [
          'Tele-counselling session (1-on-1 scheduled)',
          `District Mental Health Centre referral (${citizenProfile.district || 'Chennai'})`,
          'Emergency SOS lifeline protocol briefing'
        ],
        referralTarget: `Rajiv Gandhi Government General Hospital - DMHP Unit, ${citizenProfile.district || 'Chennai'}`,
        followUpDate: '2026-09-03',
        followUpTime: '10:30 AM IST',
        actionTaken: '',
        isHumanValidated: false
      }
    };

    // Update case in state
    setCases((prev) => [newCase, ...prev.filter((c) => c.caseId !== generatedCaseId)]);
    setCurrentCaseId(generatedCaseId);
    return newCase;
  };

  const resetToDefault = () => {
    setCases(INITIAL_CASES);
    setCurrentCaseId('RS-2026-00124');
    setCitizenProfile(DEFAULT_PROFILE);
    setScreeningAnswers(DEFAULT_SCREENING);
    setCurrentRole('citizen');
    navigateTo('public-support', 'none');
  };

  const currentCase = cases.find((c) => c.caseId === currentCaseId) || DEMO_CASE_RS_2026_00124;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        transitionType,
        screenHistory,
        currentRole,
        setRole,
        navigateTo,
        navigateBack,
        citizenProfile,
        updateCitizenProfile,
        screeningAnswers,
        updateScreeningAnswers,
        cases,
        currentCaseId,
        currentCase,
        setCurrentCaseId,
        updateCase,
        validateCaseByCounsellor,
        submitScreening,
        resetToDefault,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
