import React, { createContext, useContext, useState } from 'react';
import {
  ScreenId,
  UserRole,
  TransitionType,
  CitizenProfile,
  ScreeningAnswers,
  CaseReviewData,
  CitizenSession,
  NHAACaseData,
  CounsellorAlert,
  NHAACaseEvent,
  RiskLevel,
  SupportInterventionType
} from '../types';
import {
  INITIAL_CASES,
  DEMO_CASE_RS_2026_00124
} from '../data/initialData';
import {
  clearCitizenSession,
  clearConsent,
  createCitizenSession,
  loadCitizenSession,
  loadConsent,
  saveConsent
} from '../services/authService';
import {
  buildCaseFromScreening,
  loadCases,
  loadCitizenProfile,
  loadCounsellorAlerts,
  loadScreeningAnswers,
  persistCitizenProfile,
  persistScreeningAnswers,
  persistCases,
  persistCounsellorAlerts,
  reprocessCaseOnNhaaUpdate,
  upsertSubmittedCase,
  validateCaseByCounsellor as serviceValidateCase
} from '../services/caseService';
import {
  DEFAULT_NHAA_CASE_REF,
  getConsentedCaseData,
  loadNhaaData,
  persistNhaaData,
  resetNhaaData,
  simulateNhaaCaseEvent
} from '../services/nhaaService';

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
    validationData: {
      humanValidatedRisk: RiskLevel;
      clinicalNotes: string;
      selectedSupportTypes: SupportInterventionType[];
      referralTarget: string;
      followUpDate: string;
      followUpTime: string;
    }
  ) => void;
  submitScreening: () => CaseReviewData;
  resetToDefault: () => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  citizenSession: CitizenSession | null;
  hasConsented: boolean;
  loginCitizen: (phone: string, displayName: string) => void;
  setConsent: (consented: boolean) => void;
  revokeConsent: () => void;
  // NHAA & Continuous Monitoring
  nhaaData: NHAACaseData;
  isNhaaSyncing: boolean;
  syncNhaaCase: (caseRef?: string) => Promise<void>;
  simulateNhaaCaseUpdate: (customEvent?: Partial<NHAACaseEvent>) => void;
  alerts: CounsellorAlert[];
  activeAlert: CounsellorAlert | null;
  acknowledgeAlert: (alertId: string) => void;
  dismissActiveAlert: () => void;
  demoToast: { message: string; type: 'info' | 'alert' | 'success' } | null;
  clearDemoToast: () => void;
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
  consentNhaaAccess: true,
  consentTimestamp: '2026-09-01T08:35:00Z',
  anonymousMode: false
};

const DEFAULT_SCREENING: ScreeningAnswers = {
  emotionalDistress: 6,
  distressFrequency: 'Several days (1-3 days/week)',
  feelingOverwhelmed: 'Struggling occasionally but functioning',
  sleepDisturbance: 'Intermittent awakenings / 5-6 hours light sleep',
  energyFatigue: 'Moderate physical exhaustion',
  appetiteChanges: 'Mild drop in appetite',
  primaryStressor: 'Sub judice court proceedings and pending trial hearing',
  secondaryStressors: ['Work pressure', 'Sleep anxiety'],
  socialSupportLevel: 'Moderate support (family present but hesitant to open up)',
  selfHarmThoughts: 'none',
  copingAbility: 'Fair with periodic strain',
  additionalNotes: 'Court proceedings are causing continuous tension and irregular sleep.',
  voiceNoteRecorded: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('public-support');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['public-support']);
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);

  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(() =>
    loadCitizenProfile(DEFAULT_PROFILE)
  );
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswers>(() =>
    loadScreeningAnswers(DEFAULT_SCREENING)
  );
  const [cases, setCases] = useState<CaseReviewData[]>(() => loadCases());
  const [currentCaseId, setCurrentCaseId] = useState<string>('RS-2026-00124');
  const [citizenSession, setCitizenSession] = useState<CitizenSession | null>(() =>
    loadCitizenSession()
  );
  const [hasConsented, setHasConsented] = useState<boolean>(() => loadConsent() ?? false);
  const [nhaaData, setNhaaData] = useState<NHAACaseData>(() => loadNhaaData());
  const [isNhaaSyncing, setIsNhaaSyncing] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<CounsellorAlert[]>(() => loadCounsellorAlerts());
  const [activeAlert, setActiveAlert] = useState<CounsellorAlert | null>(null);
  const [demoToast, setDemoToast] = useState<{ message: string; type: 'info' | 'alert' | 'success' } | null>(null);

  const updateCitizenProfile = (updates: Partial<CitizenProfile>) => {
    setCitizenProfile((prev) => {
      const next = { ...prev, ...updates };
      persistCitizenProfile(next);
      return next;
    });
  };

  const updateScreeningAnswers = (updates: Partial<ScreeningAnswers>) => {
    setScreeningAnswers((prev) => {
      const next = { ...prev, ...updates };
      persistScreeningAnswers(next);
      return next;
    });
  };

  const loginCitizen = (phone: string, displayName: string) => {
    const session = createCitizenSession(phone, displayName);
    setCitizenSession(session);
    setCurrentRole('citizen');
    updateCitizenProfile({
      phone: session.phone,
      fullName: session.displayName || citizenProfile.fullName
    });
  };

  const setConsent = (consented: boolean) => {
    saveConsent(consented);
    setHasConsented(consented);
    const nowIso = new Date().toISOString();
    updateCitizenProfile({
      consentDataSharing: consented,
      consentNhaaAccess: consented,
      consentTimestamp: consented ? nowIso : undefined
    });
    if (consented) {
      const synced = getConsentedCaseData(DEFAULT_NHAA_CASE_REF);
      if (synced) {
        setNhaaData(synced);
      }
    }
  };

  const revokeConsent = () => {
    saveConsent(false);
    setHasConsented(false);
    updateCitizenProfile({
      consentDataSharing: false,
      consentNhaaAccess: false,
      consentTimestamp: undefined
    });
    const pausedNhaa: NHAACaseData = {
      ...nhaaData,
      isConsentAuthorized: false,
      monitoringStatus: 'REVOKED'
    };
    persistNhaaData(pausedNhaa);
    setNhaaData(pausedNhaa);
    setDemoToast({
      message: 'NHAA data access revoked. Continuous monitoring paused.',
      type: 'info'
    });
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
    setCases((prev) => {
      const next = prev.map((c) => (c.caseId === caseId ? { ...c, ...updates } : c));
      persistCases(next);
      return next;
    });
  };

  const validateCaseByCounsellor = (
    caseId: string,
    validationData: {
      humanValidatedRisk: RiskLevel;
      clinicalNotes: string;
      selectedSupportTypes: SupportInterventionType[];
      referralTarget: string;
      followUpDate: string;
      followUpTime: string;
    }
  ) => {
    const updated = serviceValidateCase(caseId, validationData);
    setCases((prev) => {
      const next = prev.map((c) => (c.caseId === caseId ? updated : c));
      persistCases(next);
      return next;
    });
    setAlerts((prev) => prev.map((a) => (a.caseId === caseId ? { ...a, isReviewed: true } : a)));
    setActiveAlert(null);
    setDemoToast({
      message: `Case ${caseId} validated by Dr. Priya Raman (${validationData.humanValidatedRisk}). Support Plan Initiated.`,
      type: 'success'
    });
  };

  const submitScreening = (): CaseReviewData => {
    persistCitizenProfile(citizenProfile);
    persistScreeningAnswers(screeningAnswers);
    const newCase = buildCaseFromScreening(citizenProfile, screeningAnswers, nhaaData);
    setCases((prev) => upsertSubmittedCase(prev, newCase));
    setCurrentCaseId(newCase.caseId);
    return newCase;
  };

  /**
   * Synchronizes latest state from NHAA adapter
   */
  const syncNhaaCase = async (caseRef: string = DEFAULT_NHAA_CASE_REF) => {
    setIsNhaaSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const synced = getConsentedCaseData(caseRef);
    if (synced) {
      setNhaaData(synced);
      persistNhaaData(synced);
      setDemoToast({
        message: `NHAA Case Data (${synced.nhaaCaseReference}) synchronized successfully.`,
        type: 'info'
      });
    }
    setIsNhaaSyncing(false);
  };

  /**
   * Simulates an incoming case event (e.g. Hearing Postponed 04 Sep -> 18 Sep 2026)
   * Triggers the full end-to-end continuous monitoring chain.
   */
  const simulateNhaaCaseUpdate = (customEvent?: Partial<NHAACaseEvent>) => {
    setIsNhaaSyncing(true);
    const updatedNhaa = simulateNhaaCaseEvent(DEFAULT_NHAA_CASE_REF, customEvent);
    setNhaaData(updatedNhaa);

    // Trigger AI Risk Engine Reprocessing
    const { updatedCase, newAlert } = reprocessCaseOnNhaaUpdate(
      'RS-2026-00124',
      updatedNhaa,
      citizenProfile,
      screeningAnswers
    );

    setCases((prev) => upsertSubmittedCase(prev, updatedCase));
    setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
    setActiveAlert(newAlert);
    setIsNhaaSyncing(false);

    setDemoToast({
      message: `⚡ NHAA CHANGE DETECTED: Hearing postponed to 18 Sep 2026 → Risk escalated (58 → 72 HIGH) → Counsellor Alert Generated!`,
      type: 'alert'
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alertId ? { ...a, isAcknowledged: true, acknowledgedAt: new Date().toISOString() } : a
      );
      persistCounsellorAlerts(next);
      return next;
    });
    if (activeAlert?.id === alertId) {
      setActiveAlert(null);
    }
  };

  const dismissActiveAlert = () => {
    setActiveAlert(null);
  };

  const clearDemoToast = () => {
    setDemoToast(null);
  };

  const resetToDefault = () => {
    const freshNhaa = resetNhaaData();
    persistCases(INITIAL_CASES);
    persistCitizenProfile(DEFAULT_PROFILE);
    persistScreeningAnswers(DEFAULT_SCREENING);
    persistCounsellorAlerts([]);
    clearCitizenSession();
    clearConsent();
    setCases(INITIAL_CASES);
    setCurrentCaseId('RS-2026-00124');
    setCitizenProfile(DEFAULT_PROFILE);
    setScreeningAnswers(DEFAULT_SCREENING);
    setCitizenSession(null);
    setHasConsented(false);
    setNhaaData(freshNhaa);
    setAlerts([]);
    setActiveAlert(null);
    setCurrentRole('citizen');
    setDemoToast({
      message: 'Demo state reset to baseline (Risk 58 / MODERATE, Initial NHAA Hearing 04 Sep 2026).',
      type: 'info'
    });
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
        setIsRoleSwitcherOpen,
        citizenSession,
        hasConsented,
        loginCitizen,
        setConsent,
        revokeConsent,
        nhaaData,
        isNhaaSyncing,
        syncNhaaCase,
        simulateNhaaCaseUpdate,
        alerts,
        activeAlert,
        acknowledgeAlert,
        dismissActiveAlert,
        demoToast,
        clearDemoToast
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
