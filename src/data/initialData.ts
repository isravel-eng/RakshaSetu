import { CaseReviewData, NationalMetrics, StateMetrics, DistrictMetrics } from '../types';

export const DEMO_CASE_RS_2026_00124: CaseReviewData = {
  caseId: 'RS-2026-00124',
  citizenName: 'Karthik Subramanian',
  citizenPhone: '+91 98401 23456',
  district: 'Chennai',
  state: 'Tamil Nadu',
  createdAt: '2026-09-01T08:42:00Z',
  distressScore: 78,
  riskLevel: 'HIGH',
  status: 'PENDING_REVIEW',
  screeningSummary: {
    phqScore: 'PHQ-4: 10/12 (High Emotional Load)',
    gadScore: 'GAD-2: 5/6 (Severe Anxiety Indicators)',
    primaryTrigger: 'Severe academic-financial distress and prolonged sleep deprivation',
    sleepImpact: '< 3 hours erratic sleep per night for past 3 weeks',
    socialSupport: 'Living away from family; hesitant to disclose stress',
    reportedSymptoms: [
      'Persistent cognitive exhaustion & memory lapses',
      'Acute panic episodes during quiet hours',
      'Severe appetite loss and headaches',
      'Feelings of guilt and isolation'
    ]
  },
  aiAssessment: {
    distressCategory: 'High Acute Distress with Anxiety Complex',
    confidenceScore: 92,
    recommendedTier: 'Tier-3: Immediate Specialist Intervention & Follow-up',
    keyRiskFactors: [
      'High distress severity score (78/100) exceeding regional triage threshold',
      'Chronic insomnia (>21 days) compounding anxiety symptoms',
      'Passive despair markers detected in free-text assessment notes',
      'Minimal localized physical support system'
    ],
    protectiveFactors: [
      'Proactive self-referral and voluntary screening completion',
      'No history of self-harm reported; receptive to structured counselling',
      'Strong cognitive orientation and clear communication'
    ],
    explanation: 'The screening responses indicate severe cumulative distress triggered by multiple converging environmental stressors. The combination of chronic sleep disruption and high situational anxiety warrants urgent human clinical triage to prevent acute decompensation.',
    suggestedInterventions: [
      'Immediate Tele-MANAS / Clinical Psychologist Tele-consultation within 2 hours',
      'Scheduled consultation at District Mental Health Centre, Rajiv Gandhi Govt Hospital (Chennai)',
      'Structured sleep hygiene and anxiety regulation toolkit (Tamil / English)',
      'Mandatory 48-hour follow-up check-in'
    ]
  },
  counsellorReview: {
    assignedCounsellor: 'Dr. Priya Raman (Lead Clinical Psychologist, DMHP Tamil Nadu)',
    counsellorId: 'TN-PSY-8492',
    reviewedAt: undefined,
    clinicalNotes: '',
    humanValidatedRisk: 'HIGH',
    interventionPlan: [
      'Tele-counselling session (1-on-1 scheduled)',
      'District Mental Health Centre referral (Chennai)',
      'Emergency SOS lifeline protocol briefing'
    ],
    referralTarget: 'Rajiv Gandhi Government General Hospital - DMHP Unit, Chennai',
    followUpDate: '2026-09-03',
    followUpTime: '10:30 AM IST',
    actionTaken: '',
    isHumanValidated: false
  }
};

export const INITIAL_CASES: CaseReviewData[] = [
  DEMO_CASE_RS_2026_00124,
  {
    caseId: 'RS-2026-00123',
    citizenName: 'Meera Sundaram',
    citizenPhone: '+91 94440 98765',
    district: 'Chennai',
    state: 'Tamil Nadu',
    createdAt: '2026-09-01T07:15:00Z',
    distressScore: 64,
    riskLevel: 'MODERATE',
    status: 'IN_REVIEW',
    screeningSummary: {
      phqScore: 'PHQ-4: 7/12',
      gadScore: 'GAD-2: 4/6',
      primaryTrigger: 'Workplace burnout and caregiver fatigue',
      sleepImpact: 'Frequent awakenings; 5 hours average',
      socialSupport: 'Supportive spouse but constrained time',
      reportedSymptoms: ['Emotional exhaustion', 'Chronic muscle tension']
    },
    aiAssessment: {
      distressCategory: 'Moderate Work-Life Burnout',
      confidenceScore: 88,
      recommendedTier: 'Tier-2: Guided Counselling & Self-Care Toolkit',
      keyRiskFactors: ['Prolonged stress without recuperation', 'Caregiver burden'],
      protectiveFactors: ['Stable domestic environment', 'No crisis markers'],
      explanation: 'Moderate burnout pattern with elevated somatic symptoms. Suitable for structured outpatient psychological counselling.',
      suggestedInterventions: ['Bi-weekly tele-counselling', 'Workplace stress management protocol']
    },
    counsellorReview: {
      assignedCounsellor: 'S. Anand Kumar (Senior Counsellor)',
      counsellorId: 'TN-CNS-4011',
      reviewedAt: '2026-09-01T08:00:00Z',
      clinicalNotes: 'Citizen engaged in 25-minute intake call. Reported high work demands and elderly parent care. Agreed to weekly counselling sessions.',
      humanValidatedRisk: 'MODERATE',
      interventionPlan: ['Tele-counselling series', 'Mindfulness guided audio support'],
      referralTarget: 'Tele-MANAS Tamil Nadu Hub',
      followUpDate: '2026-09-08',
      followUpTime: '04:00 PM IST',
      actionTaken: 'Initial counselling intake completed; follow-up scheduled.',
      isHumanValidated: true
    }
  },
  {
    caseId: 'RS-2026-00122',
    citizenName: 'Ananya Raghavan',
    citizenPhone: '+91 98840 11223',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    createdAt: '2026-08-31T22:10:00Z',
    distressScore: 89,
    riskLevel: 'CRITICAL',
    status: 'REFERRED',
    screeningSummary: {
      phqScore: 'PHQ-4: 12/12',
      gadScore: 'GAD-2: 6/6',
      primaryTrigger: 'Acute interpersonal crisis and severe hopelessness',
      sleepImpact: 'Severe insomnia (< 2 hours for 5 days)',
      socialSupport: 'Completely isolated',
      reportedSymptoms: ['Acute distress', 'Severe despair', 'Panic attacks']
    },
    aiAssessment: {
      distressCategory: 'Critical Acute Crisis',
      confidenceScore: 96,
      recommendedTier: 'Tier-1: Emergency Human Intervention & Physical Dispatch',
      keyRiskFactors: ['Critical distress score', 'High acute crisis markers'],
      protectiveFactors: ['Voluntary connection via emergency SOS'],
      explanation: 'Critical acute crisis markers triggered immediate priority queue routing.',
      suggestedInterventions: ['Immediate emergency response call', 'Hospital DMHP link']
    },
    counsellorReview: {
      assignedCounsellor: 'Dr. Priya Raman (Lead Clinical Psychologist)',
      counsellorId: 'TN-PSY-8492',
      reviewedAt: '2026-08-31T22:25:00Z',
      clinicalNotes: 'Urgent crisis intervention performed over call. Emergency contact verified and citizen connected with Coimbatore Medical College DMHP team.',
      humanValidatedRisk: 'CRITICAL',
      interventionPlan: ['Emergency tele-support', 'District mobile health team notification'],
      referralTarget: 'Coimbatore Medical College Hospital - Psychiatric Emergency',
      followUpDate: '2026-09-01',
      followUpTime: '11:00 AM IST',
      actionTaken: 'Specialist dispatched and citizen stabilized with guardian present.',
      isHumanValidated: true
    }
  },
  {
    caseId: 'RS-2026-00121',
    citizenName: 'M. Suresh',
    citizenPhone: '+91 97900 44556',
    district: 'Madurai',
    state: 'Tamil Nadu',
    createdAt: '2026-08-31T19:30:00Z',
    distressScore: 42,
    riskLevel: 'MILD',
    status: 'RESOLVED',
    screeningSummary: {
      phqScore: 'PHQ-4: 3/12',
      gadScore: 'GAD-2: 2/6',
      primaryTrigger: 'Mild exam anxiety and study schedule confusion',
      sleepImpact: '6-7 hours, mild difficulty falling asleep',
      socialSupport: 'Strong peer group and supportive parents',
      reportedSymptoms: ['Pre-exam nervousness']
    },
    aiAssessment: {
      distressCategory: 'Mild Situational Stress',
      confidenceScore: 91,
      recommendedTier: 'Tier-4: Psychoeducation & Community Resources',
      keyRiskFactors: ['Upcoming state board examinations'],
      protectiveFactors: ['Robust social buffer', 'High resilience index'],
      explanation: 'Standard situational anxiety manageable with psychoeducational modules.',
      suggestedInterventions: ['Self-paced stress management guide', 'Peer helpline access']
    },
    counsellorReview: {
      assignedCounsellor: 'K. Balaji (Youth Counsellor)',
      counsellorId: 'TN-CNS-2931',
      reviewedAt: '2026-08-31T20:10:00Z',
      clinicalNotes: 'Provided study-break relaxation guidance and breathing exercises. Citizen expressed satisfaction and relief.',
      humanValidatedRisk: 'MILD',
      interventionPlan: ['Psychoeducation toolkit sent via SMS/WhatsApp'],
      referralTarget: 'Madurai District Youth Wellbeing Cell',
      followUpDate: '2026-09-15',
      followUpTime: '02:00 PM IST',
      actionTaken: 'Resolved with self-care toolkit delivery.',
      isHumanValidated: true
    }
  }
];

export const INITIAL_NATIONAL_METRICS: NationalMetrics = {
  totalScreenings: 148920,
  criticalCases: 3840,
  activeCounsellors: 2410,
  triageTimeMinutes: 4.2,
  stateBreakdown: [
    { state: 'Tamil Nadu', cases: 18450, highRisk: 1420, capacity: 94, status: 'OPTIMAL' },
    { state: 'Maharashtra', cases: 24300, highRisk: 2180, capacity: 88, status: 'MODERATE' },
    { state: 'Karnataka', cases: 15200, highRisk: 1190, capacity: 92, status: 'OPTIMAL' },
    { state: 'Uttar Pradesh', cases: 29800, highRisk: 3100, capacity: 79, status: 'STRAINED' },
    { state: 'Kerala', cases: 11400, highRisk: 680, capacity: 98, status: 'OPTIMAL' },
    { state: 'West Bengal', cases: 16900, highRisk: 1540, capacity: 84, status: 'MODERATE' },
    { state: 'Delhi NCR', cases: 14200, highRisk: 1350, capacity: 91, status: 'OPTIMAL' },
    { state: 'Rajasthan', cases: 11100, highRisk: 990, capacity: 82, status: 'MODERATE' }
  ],
  trendData: [
    { time: '00:00', screenings: 120, criticalAlerts: 4 },
    { time: '04:00', screenings: 85, criticalAlerts: 6 },
    { time: '08:00', screenings: 430, criticalAlerts: 18 },
    { time: '12:00', screenings: 890, criticalAlerts: 34 },
    { time: '16:00', screenings: 1120, criticalAlerts: 42 },
    { time: '20:00', screenings: 980, criticalAlerts: 38 },
    { time: '23:00', screenings: 340, criticalAlerts: 12 }
  ]
};

export const INITIAL_STATE_METRICS: StateMetrics = {
  stateName: 'Tamil Nadu',
  totalCases: 18450,
  pendingValidation: 42,
  activeFollowUps: 318,
  resolvedThisMonth: 14280,
  districtStats: [
    { district: 'Chennai', cases: 4820, riskScoreAvg: 68.4, counsellorsOnline: 86, status: 'High Volume' },
    { district: 'Coimbatore', cases: 2740, riskScoreAvg: 61.2, counsellorsOnline: 48, status: 'Normal' },
    { district: 'Madurai', cases: 2310, riskScoreAvg: 58.7, counsellorsOnline: 39, status: 'Normal' },
    { district: 'Tiruchirappalli', cases: 1890, riskScoreAvg: 55.4, counsellorsOnline: 32, status: 'Normal' },
    { district: 'Salem', cases: 1640, riskScoreAvg: 59.1, counsellorsOnline: 28, status: 'Normal' },
    { district: 'Tirunelveli', cases: 1420, riskScoreAvg: 54.0, counsellorsOnline: 24, status: 'Normal' },
    { district: 'Vellore', cases: 1380, riskScoreAvg: 57.3, counsellorsOnline: 22, status: 'Normal' },
    { district: 'Kanchipuram', cases: 1250, riskScoreAvg: 53.8, counsellorsOnline: 20, status: 'Normal' }
  ]
};

export const INITIAL_DISTRICT_METRICS: DistrictMetrics = {
  districtName: 'Chennai',
  stateName: 'Tamil Nadu',
  activeQueue: 42,
  criticalAlerts: 6,
  counsellorsAvailable: 86,
  avgResponseMins: 3.4,
  centers: [
    {
      name: 'Rajiv Gandhi Government General Hospital (RGGGH) - Dept of Psychiatry',
      address: 'EVR Periyar Salai, Park Town, Chennai - 600003',
      phone: '044-25305000 / 14416',
      type: 'Government Tertiary Hospital & DMHP Hub',
      distanceKm: 3.2,
      availableSlots: 14
    },
    {
      name: 'Institute of Mental Health (IMH) Chennai',
      address: 'Medavakkam Tank Road, Kilpauk, Chennai - 600010',
      phone: '044-26441041',
      type: 'Specialized State Mental Health Institute',
      distanceKm: 5.8,
      availableSlots: 22
    },
    {
      name: 'Government Stanley Medical College Hospital - Psychiatric OPD',
      address: 'Old Jail Rd, Royapuram, Chennai - 600001',
      phone: '044-25281351',
      type: 'Government Medical College Hospital',
      distanceKm: 6.4,
      availableSlots: 9
    },
    {
      name: 'Sneha Crisis Intervention Centre (24x7 Suicide Prevention Helpline)',
      address: '11, Park View Road, R.A. Puram, Chennai - 600028',
      phone: '044-24640050 / 044-24640060',
      type: 'Verified NGO Support Partner & Tele-Support',
      distanceKm: 7.1,
      availableSlots: 99
    },
    {
      name: 'Tele-MANAS Tamil Nadu Hub (State Toll-Free Lifeline)',
      address: 'National Tele Mental Health Programme Node, Chennai',
      phone: '14416 / 1800-891-4416',
      type: '24x7 Free Multilingual Emergency Tele-Counselling',
      distanceKm: 0.1,
      availableSlots: 50
    }
  ]
};
