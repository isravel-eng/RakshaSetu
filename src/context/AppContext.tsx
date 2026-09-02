import React, { createContext, useContext, useState } from 'react';
import {
  ScreenId,
  UserRole,
  TransitionType,
  CitizenProfile,
  ScreeningAnswers,
  CaseReviewData,
  CitizenSession
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
  loadScreeningAnswers,
  persistCitizenProfile,
  persistScreeningAnswers,
  persistCases,
  upsertSubmittedCase
} from '../services/caseService';

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
  citizenSession: CitizenSession | null;
  hasConsented: boolean;
  loginCitizen: (phone: string, displayName: string) => void;
  setConsent: (consented: boolean) => void;
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
  consentDataSharing: false,
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
  const [hasConsented, setHasConsented] = useState<boolean>(() => loadConsent());

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
    updateCitizenProfile({ consentDataSharing: consented });
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
    persistCitizenProfile(citizenProfile);
    persistScreeningAnswers(screeningAnswers);
    const newCase = buildCaseFromScreening(citizenProfile, screeningAnswers);
    setCases((prev) => upsertSubmittedCase(prev, newCase));
    setCurrentCaseId(newCase.caseId);
    return newCase;
  };

  const resetToDefault = () => {
    persistCases(INITIAL_CASES);
    persistCitizenProfile(DEFAULT_PROFILE);
    persistScreeningAnswers(DEFAULT_SCREENING);
    clearCitizenSession();
    clearConsent();
    setCases(INITIAL_CASES);
    setCurrentCaseId('RS-2026-00124');
    setCitizenProfile(DEFAULT_PROFILE);
    setScreeningAnswers(DEFAULT_SCREENING);
    setCitizenSession(null);
    setHasConsented(false);
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
        setIsRoleSwitcherOpen,
        citizenSession,
        hasConsented,
        loginCitizen,
        setConsent
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
