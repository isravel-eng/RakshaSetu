import { CitizenProfile, ConfidenceLevel, RiskAssessmentResult, RiskLevel, ScreeningAnswers, TriagePriority } from '../types';

/**
 * RakshaSetu Core AI Risk Engine (Preliminary Screening & Triage)
 *
 * NOTE: This engine provides triage decision-support scoring for certified human review.
 * It is NOT a clinical diagnosis and never claims to diagnose a mental-health condition.
 * All assessments require mandatory clinical validation by a licensed professional.
 */

export const DISCLAIMER_TEXT =
  'AI PRELIMINARY SCREENING — HUMAN VALIDATION REQUIRED. This triage score is a decision-support aid and does not constitute a clinical diagnosis.';

/**
 * Deterministically evaluates screening responses to generate an explainable,
 * preliminary risk level, priority tier, and structured clinical triage summary.
 */
export function evaluateRisk(
  answers: ScreeningAnswers,
  profile?: CitizenProfile
): RiskAssessmentResult {
  const contributingFactors: string[] = [];
  const protectiveFactors: string[] = [];

  // 1. Emotional Distress Intensity (0–10 scale) -> Max 25 pts
  const distressScale = Math.max(0, Math.min(10, answers.emotionalDistress ?? 0));
  const distressPoints = Math.round((distressScale / 10) * 25);
  if (distressScale >= 8) {
    contributingFactors.push(`High acute distress intensity (${distressScale}/10) on initial self-report`);
  } else if (distressScale >= 5) {
    contributingFactors.push(`Moderate emotional distress intensity (${distressScale}/10)`);
  }

  // 2. Frequency of Distress (PHQ-4 Mood Marker) -> Max 15 pts
  let frequencyPoints = 0;
  const freq = answers.distressFrequency || '';
  if (freq.includes('Nearly every day')) {
    frequencyPoints = 15;
    contributingFactors.push('Persistent daily distress over the past 2+ weeks');
  } else if (freq.includes('More than half')) {
    frequencyPoints = 10;
    contributingFactors.push('Frequent distress episodes occurring more than half the days');
  } else if (freq.includes('Several days')) {
    frequencyPoints = 5;
  } else if (freq.includes('Not at all')) {
    protectiveFactors.push('Low frequency of depressive/anxious mood in past 2 weeks');
  }

  // 3. Functional Impact & Coping Overwhelm -> Max 15 pts
  let overwhelmPoints = 0;
  const overwhelm = answers.feelingOverwhelmed || '';
  if (overwhelm.includes('Paralyzed')) {
    overwhelmPoints = 15;
    contributingFactors.push('Severe functional paralysis with acute cognitive overwhelm');
  } else if (overwhelm.includes('Severely overwhelmed') || overwhelm.includes('unable to cope')) {
    overwhelmPoints = 12;
    contributingFactors.push('Severe impairment in daily functional tasks and coping');
  } else if (overwhelm.includes('Struggling occasionally')) {
    overwhelmPoints = 5;
    protectiveFactors.push('Retains baseline daily functioning despite periodic stress');
  } else if (overwhelm.includes('Managing well')) {
    protectiveFactors.push('Strong daily task coping ability and psychological resilience');
  }

  // 4. Sleep Disturbance (Somatic Marker) -> Max 15 pts
  let sleepPoints = 0;
  const sleep = answers.sleepDisturbance || '';
  if (sleep.includes('Severe insomnia') || sleep.includes('< 3 hours')) {
    sleepPoints = 15;
    contributingFactors.push('Severe sleep disruption (< 3 hours nightly) compounding anxiety symptoms');
  } else if (sleep.includes('Excessive sleeping') || sleep.includes('> 10 hours')) {
    sleepPoints = 10;
    contributingFactors.push('Atypical hypersomnia and persistent unrefreshed sleep');
  } else if (sleep.includes('Intermittent') || sleep.includes('5-6 hours')) {
    sleepPoints = 5;
    contributingFactors.push('Intermittent sleep awakenings affecting daily stamina');
  } else if (sleep.includes('Normal') || sleep.includes('7-8 hours')) {
    protectiveFactors.push('Stable, restorative sleep pattern intact (7–8 hours)');
  }

  // 5. Energy & Physical Fatigue -> Max 10 pts
  let fatiguePoints = 0;
  const fatigue = answers.energyFatigue || '';
  if (fatigue.includes('Extreme fatigue') || fatigue.includes('brain fog')) {
    fatiguePoints = 10;
    contributingFactors.push('Extreme daily fatigue and cognitive brain fog');
  } else if (fatigue.includes('Moderate physical exhaustion')) {
    fatiguePoints = 6;
    contributingFactors.push('Moderate physical exhaustion and depleted energy reserves');
  } else if (fatigue.includes('Mild')) {
    fatiguePoints = 2;
  } else if (fatigue.includes('Normal energy')) {
    protectiveFactors.push('Normal physical energy reserves preserved');
  }

  // 6. Appetite & Metabolic Changes -> Max 5 pts
  let appetitePoints = 0;
  const appetite = answers.appetiteChanges || '';
  if (appetite.includes('Significant reduction')) {
    appetitePoints = 5;
    contributingFactors.push('Significant appetite reduction affecting physical stamina');
  } else if (appetite.includes('Stress eating') || appetite.includes('binge')) {
    appetitePoints = 4;
    contributingFactors.push('Stress-related erratic eating patterns');
  } else if (appetite.includes('Mild drop')) {
    appetitePoints = 2;
  } else if (appetite.includes('No significant')) {
    protectiveFactors.push('Appetite and dietary habits remain stable');
  }

  // 7. Social Support Deficit -> Max 10 pts
  let supportPoints = 0;
  const support = answers.socialSupportLevel || '';
  if (support.includes('Completely isolated')) {
    supportPoints = 10;
    contributingFactors.push('Severe social isolation with no local support system');
  } else if (support.includes('Minimal') || support.includes('living alone')) {
    supportPoints = 7;
    contributingFactors.push('Minimal localized support network and hesitation to disclose distress');
  } else if (support.includes('Moderate support')) {
    supportPoints = 3;
    contributingFactors.push('Moderate family support present but communication constraints noted');
  } else if (support.includes('Strong')) {
    protectiveFactors.push('Strong, active family and peer support system available');
  }

  // 8. Primary Stressor Context
  if (answers.primaryStressor && answers.primaryStressor !== 'None' && answers.primaryStressor.trim()) {
    contributingFactors.push(`Primary environmental stressor: ${answers.primaryStressor}`);
  }

  // 9. Secondary Stressors
  if (Array.isArray(answers.secondaryStressors) && answers.secondaryStressors.length > 0) {
    const validStressors = answers.secondaryStressors.filter(Boolean);
    if (validStressors.length > 0) {
      contributingFactors.push(`Additional converging stressors: ${validStressors.join(', ')}`);
    }
  }

  // 10. Additional Notes Text Signals (Keywords)
  if (answers.additionalNotes && answers.additionalNotes.trim()) {
    const notesLower = answers.additionalNotes.toLowerCase();
    if (
      notesLower.includes('panic') ||
      notesLower.includes('racing') ||
      notesLower.includes('anxiety') ||
      notesLower.includes('drained') ||
      notesLower.includes('exhausted') ||
      notesLower.includes('crying')
    ) {
      contributingFactors.push('Intake notes reflect somatic tension and racing anxiety episodes');
    }
  }

  // Protective Factor: Voluntary Engagement & Emergency Contact
  protectiveFactors.push('Voluntary screening completion and active engagement with support system');
  if (profile?.emergencyContactPhone && profile.emergencyContactPhone.trim()) {
    protectiveFactors.push('Designated emergency support contact registered on intake profile');
  }

  // Baseline weighted score sum (0–95)
  let rawScore =
    distressPoints +
    frequencyPoints +
    overwhelmPoints +
    sleepPoints +
    fatiguePoints +
    appetitePoints +
    supportPoints;

  // 11. Self-Harm Thoughts & Emergency Signals (RULES 1 & 2)
  const selfHarm = (answers.selfHarmThoughts || 'none').toLowerCase();
  let isEmergency = false;
  let riskLevel: RiskLevel = 'LOW';
  let priority: TriagePriority = 'ROUTINE';
  let confidence: ConfidenceLevel = 'HIGH';
  let confidenceScore = 92;
  let finalScore = Math.max(15, Math.min(98, rawScore));

  if (selfHarm === 'immediate') {
    // Immediate acute crisis
    isEmergency = true;
    riskLevel = 'CRITICAL';
    priority = 'IMMEDIATE';
    confidence = 'HIGH';
    confidenceScore = 96;
    finalScore = Math.max(finalScore, 95);
    contributingFactors.unshift('CRITICAL ALERT: Immediate self-harm thoughts with intent reported (Safety Protocol Triggered)');
  } else if (selfHarm === 'frequent') {
    // Frequent / intense crisis thoughts
    isEmergency = true;
    riskLevel = 'CRITICAL';
    priority = 'IMMEDIATE';
    confidence = 'HIGH';
    confidenceScore = 94;
    finalScore = Math.max(finalScore, 90);
    contributingFactors.unshift('CRITICAL ALERT: Frequent or intense distressing self-harm thoughts reported');
  } else if (selfHarm === 'passive') {
    // Passive despair ideation
    finalScore = Math.max(finalScore + 12, 70);
    contributingFactors.push('Passive despair ideation reported on safety evaluation');
    if (finalScore >= 75) {
      riskLevel = 'HIGH';
      priority = 'URGENT';
    } else {
      riskLevel = 'MODERATE';
      priority = 'PRIORITY';
    }
  } else {
    // No self harm
    protectiveFactors.unshift('No active or passive self-harm thoughts reported');
    if (finalScore >= 75) {
      riskLevel = 'HIGH';
      priority = 'URGENT';
    } else if (finalScore >= 45) {
      riskLevel = 'MODERATE';
      priority = 'PRIORITY';
    } else {
      riskLevel = 'LOW';
      priority = 'ROUTINE';
    }
  }

  // Map into structured Tier recommendations & Interventions
  let distressCategory = '';
  let recommendedTier = '';
  let recommendedAction = '';
  let explanation = '';
  let suggestedInterventions: string[] = [];

  const district = profile?.district || 'Chennai';

  if (riskLevel === 'CRITICAL') {
    distressCategory = 'Critical Acute Crisis';
    recommendedTier = 'Tier-1: Emergency Human Intervention & Physical Dispatch';
    recommendedAction =
      'Immediate crisis intervention via 24x7 Lifeline (14416) and prompt linkage with emergency hospital psychiatric services.';
    explanation =
      'The screening indicates critical distress markers with active safety alerts. An immediate clinical triage protocol has been triggered for urgent specialist tele-contact and safety planning.';
    suggestedInterventions = [
      'Immediate 24x7 Tele-MANAS / Clinical Psychologist Tele-intervention within 30 minutes',
      `Emergency psychiatric evaluation linkage at ${district} District Mental Health Center`,
      'Active crisis de-escalation and safety contract protocol',
      'Continuous monitoring and designated family/contact linkage'
    ];
  } else if (riskLevel === 'HIGH') {
    distressCategory = 'High Acute Distress with Anxiety Complex';
    recommendedTier = 'Tier-3: Immediate Specialist Intervention & Follow-up';
    recommendedAction =
      'Priority tele-counselling consultation within 2–4 hours and structured referral to District Mental Health Programme.';
    explanation =
      'The screening responses indicate severe cumulative distress triggered by multiple converging stressors and chronic sleep disruption. Prompt human clinical triage is indicated to prevent acute decompensation.';
    suggestedInterventions = [
      'Immediate Tele-MANAS / Clinical Psychologist Tele-consultation within 2 hours',
      `Scheduled consultation at District Mental Health Centre (${district})`,
      'Structured sleep hygiene and anxiety regulation toolkit',
      'Mandatory 48-hour clinical follow-up check-in'
    ];
  } else if (riskLevel === 'MODERATE') {
    distressCategory = 'Moderate Situational Distress';
    recommendedTier = 'Tier-2: Guided Counselling & Self-Care Toolkit';
    recommendedAction =
      'Scheduled tele-counselling session within 24–48 hours and structured self-regulation modules.';
    explanation =
      'The screening indicates moderate situational distress with manageable functional impact. Structured outpatient tele-counselling and stress reduction strategies are recommended.';
    suggestedInterventions = [
      'Scheduled 1-on-1 tele-counselling session (within 48 hours)',
      'Cognitive grounding and sleep restoration guidance',
      'Community peer support group access',
      'Weekly wellness check-in'
    ];
  } else {
    distressCategory = 'Mild Situational Stress';
    recommendedTier = 'Tier-4: Psychoeducation & Community Resources';
    recommendedAction =
      'Self-paced emotional wellness toolkit, sleep hygiene guidance, and optional helpline access.';
    explanation =
      'The screening indicates mild situational stress within manageable psychological thresholds. Psychoeducational resources and preventative wellness practices are recommended.';
    suggestedInterventions = [
      'Self-paced emotional wellness toolkit and mindfulness exercises',
      'Sleep hygiene and lifestyle stress management guide',
      'Access to 24x7 Tele-MANAS toll-free line (14416) if symptoms increase',
      'Optional 14-day check-in reminder'
    ];
  }

  // Calculate confidence score based on answer completeness
  const completedFields = [
    answers.emotionalDistress !== undefined,
    Boolean(answers.distressFrequency),
    Boolean(answers.feelingOverwhelmed),
    Boolean(answers.sleepDisturbance),
    Boolean(answers.energyFatigue),
    Boolean(answers.appetiteChanges),
    Boolean(answers.socialSupportLevel),
    Boolean(answers.selfHarmThoughts)
  ].filter(Boolean).length;

  if (completedFields >= 7) {
    confidence = 'HIGH';
    confidenceScore = isEmergency ? 96 : 92;
  } else if (completedFields >= 4) {
    confidence = 'MEDIUM';
    confidenceScore = 82;
  } else {
    confidence = 'LOW';
    confidenceScore = 68;
  }

  return {
    riskLevel,
    score: finalScore,
    confidence,
    confidenceScore,
    priority,
    contributingFactors,
    protectiveFactors,
    recommendedAction,
    explanation,
    requiresHumanReview: true,
    emergencyFlag: isEmergency,
    recommendedTier,
    distressCategory,
    suggestedInterventions,
    disclaimer: DISCLAIMER_TEXT
  };
}
