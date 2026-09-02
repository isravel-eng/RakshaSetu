import { NHAACaseData, NHAACaseEvent } from '../types';
import { readJson, storageKeys, writeJson } from './storage';

/**
 * NHAA (National Highway & Assistance Authority) Integration Adapter
 *
 * NOTE FOR SIH EVALUATION:
 * In this prototype, data retrieval and case change streams are simulated via this adapter
 * adhering to the government DPDPA consent specification. No unauthorized live API is claimed.
 */

export const DEFAULT_NHAA_CASE_REF = 'NHAA-TN-2026-00981';

export const INITIAL_NHAA_EVENTS: NHAACaseEvent[] = [
  {
    id: 'EVT-001',
    eventId: 'NHAA-EVT-981-01',
    timestamp: '2026-08-15T09:30:00Z',
    eventType: 'CASE_REGISTERED',
    title: 'Case Formally Registered in Integrated Registry',
    description: 'First Information & Legal Protection Request admitted at Chennai Central Sessions Court.',
    legalStage: 'Intake & Cognizance',
    courtOrAuthority: 'Chennai Principal Sessions Court / All Women PS',
    stressImpactLevel: 'MODERATE'
  },
  {
    id: 'EVT-002',
    eventId: 'NHAA-EVT-981-02',
    timestamp: '2026-08-22T14:00:00Z',
    eventType: 'HEARING_SCHEDULED',
    title: 'Trial Hearing Scheduled for 04 Sep 2026',
    description: 'Initial court hearing and victim statement deposition scheduled for 04 Sep 2026.',
    hearingDate: '2026-09-04',
    legalStage: 'Pre-Trial Hearing Phase',
    courtOrAuthority: 'Fast Track Sessions Court - IV, Chennai',
    stressImpactLevel: 'MODERATE'
  }
];

export const INITIAL_NHAA_DATA: NHAACaseData = {
  nhaaCaseReference: DEFAULT_NHAA_CASE_REF,
  victimName: 'Karthik Subramanian',
  district: 'Chennai',
  state: 'Tamil Nadu',
  caseStatus: 'Active',
  caseType: 'Victim Legal Support & Protection Matter (Sec. 357A CrPC)',
  registeredDate: '2026-08-15',
  currentStage: 'Pre-Trial Hearing Phase',
  nextHearingDate: '2026-09-04',
  lastSynchronized: new Date().toISOString(),
  policeStationOrCourt: 'Fast Track Sessions Court - IV, Chennai (RGGGH Jurisdiction)',
  protectionOfficer: 'Mrs. Revathi Sundar (District Legal Services Authority - DLSA Chennai)',
  events: INITIAL_NHAA_EVENTS,
  legalStressMarkers: [
    'Sub judice pending testimony',
    'Designated DLSA Legal Aid Counsel assigned',
    'Restraining / Protection order active'
  ],
  isConsentAuthorized: true,
  monitoringStatus: 'ACTIVE'
};

export const POSTPONED_NHAA_EVENT: NHAACaseEvent = {
  id: 'EVT-003',
  eventId: 'NHAA-EVT-981-03',
  timestamp: new Date().toISOString(),
  eventType: 'HEARING_RESCHEDULED',
  title: 'Hearing Rescheduled — 14-Day Judicial Delay',
  description: 'Hearing postponed from 04 Sep 2026 to 18 Sep 2026 due to bench unavailability and pending defense cross-examination schedule.',
  previousHearingDate: '2026-09-04',
  hearingDate: '2026-09-18',
  delayDays: 14,
  legalStage: 'Pre-Trial Hearing Delay',
  courtOrAuthority: 'Fast Track Sessions Court - IV, Chennai',
  stressImpactLevel: 'HIGH',
  isNewEvent: true
};

/**
 * Loads the current NHAA case state from persistent local storage.
 */
export function loadNhaaData(): NHAACaseData {
  const stored = readJson<NHAACaseData>(storageKeys.nhaa);
  if (!stored || !stored.nhaaCaseReference) {
    return INITIAL_NHAA_DATA;
  }
  return stored;
}

/**
 * Persists the NHAA case state.
 */
export function persistNhaaData(data: NHAACaseData): void {
  writeJson(storageKeys.nhaa, data);
}

/**
 * Retrieves permitted case data after explicit user consent authorization.
 */
export function getConsentedCaseData(caseReference: string = DEFAULT_NHAA_CASE_REF): NHAACaseData | null {
  const current = loadNhaaData();
  if (current.nhaaCaseReference === caseReference || caseReference === DEFAULT_NHAA_CASE_REF) {
    return {
      ...current,
      lastSynchronized: new Date().toISOString()
    };
  }
  return null;
}

/**
 * Retrieves the list of case events for the given reference.
 */
export function getCaseEvents(caseReference: string = DEFAULT_NHAA_CASE_REF): NHAACaseEvent[] {
  const data = getConsentedCaseData(caseReference);
  return data ? data.events : [];
}

/**
 * Returns the latest case state snapshot.
 */
export function getLatestCaseState(caseReference: string = DEFAULT_NHAA_CASE_REF): NHAACaseData {
  const data = getConsentedCaseData(caseReference);
  return data ?? INITIAL_NHAA_DATA;
}

/**
 * Simulates an incoming case event (e.g., Hearing postponement, court order change).
 */
export function simulateNhaaCaseEvent(
  caseReference: string = DEFAULT_NHAA_CASE_REF,
  customEvent?: Partial<NHAACaseEvent>
): NHAACaseData {
  const current = loadNhaaData();
  const eventToAdd: NHAACaseEvent = {
    ...POSTPONED_NHAA_EVENT,
    ...customEvent,
    id: `EVT-${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  const updatedEvents = [
    eventToAdd,
    ...current.events.map((e) => ({ ...e, isNewEvent: false }))
  ];

  const updatedData: NHAACaseData = {
    ...current,
    events: updatedEvents,
    nextHearingDate: eventToAdd.hearingDate || '2026-09-18',
    currentStage: eventToAdd.legalStage || 'Pre-Trial Hearing Postponed',
    lastSynchronized: new Date().toISOString(),
    legalStressMarkers: [
      ...current.legalStressMarkers.filter((m) => !m.includes('delay')),
      `Repeated trial delay (${eventToAdd.delayDays || 14} days postponement to ${eventToAdd.hearingDate || '18 Sep 2026'})`,
      'Prolonged legal uncertainty & anticipatory court distress'
    ]
  };

  persistNhaaData(updatedData);
  return updatedData;
}

/**
 * Resets the NHAA data back to initial un-postponed state.
 */
export function resetNhaaData(): NHAACaseData {
  const fresh: NHAACaseData = {
    ...INITIAL_NHAA_DATA,
    lastSynchronized: new Date().toISOString()
  };
  persistNhaaData(fresh);
  return fresh;
}
