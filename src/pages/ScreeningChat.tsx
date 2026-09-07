import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';
import {
  BackendChatResponse,
  ChatMessage,
  createCase,
  ensureCitizenSession,
  predictionToRiskResult,
  submitChatAssessment,
  submitVoiceAssessment,
} from '../services/backendApi';

const FIELD_LABELS: Record<string, string> = {
  emotional_distress: 'Emotional distress',
  distress_frequency: 'Frequency',
  overwhelm: 'Overwhelm',
  sleep_quality: 'Sleep',
  fatigue: 'Fatigue',
  social_support: 'Social support',
  coping_ability: 'Coping',
  self_harm_indicator: 'Safety check',
};

const REQUIRED_FIELD_COUNT = Object.keys(FIELD_LABELS).length;

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Namaste 🙏 I am RakshaSetu's assessment companion. I will have a short, private conversation with you — not a long questionnaire. You can type your answers or tap the 🎤 microphone to speak. To begin, could you tell me how you have been feeling emotionally over the last couple of weeks? For example, on a scale of 0 to 10, how intense is your distress right now?",
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read recorded audio'));
    reader.readAsDataURL(blob);
  });
}

export const ScreeningChat: React.FC = () => {
  const {
    citizenProfile,
    currentCase,
    updateCase,
    navigateTo,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [collectedFields, setCollectedFields] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [safetySignal, setSafetySignal] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const voiceSupported =
    typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, isRecording]);

  const collectedCount = new Set(collectedFields).size;
  const allCollected = collectedCount >= REQUIRED_FIELD_COUNT;

  const persistMlResult = (
    response: BackendChatResponse,
    backendCase: { id: number; case_number: string },
  ) => {
    const remoteRisk = predictionToRiskResult(response.prediction);
    if (!remoteRisk) {
      throw new Error('The ML service returned no prediction.');
    }
    const nowIso = new Date().toISOString();
    updateCase(currentCase.caseId, {
      citizenName: citizenProfile.anonymousMode ? 'Anonymous Citizen' : citizenProfile.fullName,
      citizenPhone: citizenProfile.anonymousMode ? 'Protected Token' : citizenProfile.phone,
      district: citizenProfile.district,
      state: citizenProfile.state,
      updatedAt: nowIso,
      distressScore: remoteRisk.score,
      riskLevel: remoteRisk.riskLevel as typeof currentCase.riskLevel,
      priority: remoteRisk.priority as typeof currentCase.priority,
      emergencyFlag: remoteRisk.emergencyFlag,
      status: remoteRisk.emergencyFlag ? 'IN_REVIEW' : 'PENDING_REVIEW',
      monitoringActive: true,
      aiAssessment: {
        ...currentCase.aiAssessment,
        distressCategory: remoteRisk.distressCategory,
        confidenceScore: remoteRisk.confidenceScore,
        confidenceLevel: remoteRisk.confidence as typeof currentCase.aiAssessment.confidenceLevel,
        priority: remoteRisk.priority as typeof currentCase.aiAssessment.priority,
        emergencyFlag: remoteRisk.emergencyFlag,
        recommendedTier: remoteRisk.recommendedTier,
        recommendedAction: remoteRisk.recommendedAction,
        keyRiskFactors: remoteRisk.contributingFactors,
        protectiveFactors: remoteRisk.protectiveFactors,
        explanation: remoteRisk.explanation,
        requiresHumanReview: remoteRisk.requiresHumanReview,
        disclaimer: remoteRisk.disclaimer,
        trend: remoteRisk.trend ?? undefined,
        modelVersion: remoteRisk.modelVersion ?? undefined,
        urgentProbability: remoteRisk.urgentProbability ?? undefined,
        mlRiskLevel: remoteRisk.mlRiskLevel ?? undefined,
      },
      riskHistory: [
        {
          ...currentCase.riskHistory[0],
          id: `RH-${Date.now()}`,
          timestamp: nowIso,
          score: remoteRisk.score,
          riskLevel: remoteRisk.riskLevel as typeof currentCase.riskHistory[0]['riskLevel'],
          priority: remoteRisk.priority as typeof currentCase.riskHistory[0]['priority'],
          trigger: 'INITIAL_SCREENING',
          triggerLabel: `OpenAI Conversational Assessment + ML prediction (${response.prediction?.model_version || 'unknown'})`,
          reason: `Conversational assessment conducted by OpenAI, structured fields extracted, and evaluated by the RakshaSetu ML service. Backend case: ${backendCase.case_number}.`,
          contributingFactors: remoteRisk.contributingFactors,
          protectiveFactors: remoteRisk.protectiveFactors,
        },
        ...currentCase.riskHistory.slice(1),
      ],
    });
  };

  /**
   * Reuses the existing backend citizen session + case so repeated chats
   * accumulate chronological check-in history for trend detection.
   */
  const ensureBackendContext = async () => {
    let backendCaseId = sessionStorage.getItem('rakshasetu.backendCaseId');
    let backendCaseNumber = sessionStorage.getItem('rakshasetu.backendCaseNumber');
    let token = sessionStorage.getItem('rakshasetu.backendToken');

    if (!token) {
      const session = await ensureCitizenSession(citizenProfile);
      token = session.token;
      sessionStorage.setItem('rakshasetu.backendToken', session.token);
    }
    if (!backendCaseId) {
      const backendCase = await createCase(token, citizenProfile, 'TRIAL');
      backendCaseId = String(backendCase.id);
      backendCaseNumber = backendCase.case_number;
      sessionStorage.setItem('rakshasetu.backendCaseId', backendCaseId);
      sessionStorage.setItem('rakshasetu.backendCaseNumber', backendCaseNumber);
    }
    return { token, caseId: Number(backendCaseId), caseNumber: backendCaseNumber || `RS-${Date.now()}` };
  };

  const finalizeTurn = async (response: BackendChatResponse, userText?: string | null) => {
    setMessages((prev) => [
      ...prev,
      ...(userText ? [{ role: 'user' as const, content: userText }] : []),
      { role: 'assistant', content: response.reply },
    ]);
    setCollectedFields(
      Object.keys(FIELD_LABELS).filter((field) => !response.assessment.missing_fields.includes(field)),
    );
    setSafetySignal(Number(response.assessment.self_harm_indicator) === 1);

    if (response.assessment.assessment_complete && response.prediction) {
      const context = await ensureBackendContext();
      setIsComplete(true);
      persistMlResult(response, { id: context.caseId, case_number: context.caseNumber });
      sessionStorage.setItem('rakshasetu.lastPrediction', JSON.stringify(response.prediction));
      window.setTimeout(() => navigateTo('assessment-result', 'push'), 1200);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending || isComplete) return;

    setIsSending(true);
    setError('');
    const userMessage: ChatMessage = { role: 'user', content: text };
    const transcript = [...messages, userMessage];
    setMessages(transcript);
    setInput('');

    try {
      const context = await ensureBackendContext();
      const response = await submitChatAssessment(context.token, context.caseId, transcript);
      await finalizeTurn(response, null);
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Unable to reach the assessment service.';
      setError(message);
      // Restore the transcript so the victim can retry.
      setMessages((prev) => prev.filter((m) => m !== userMessage));
    } finally {
      setIsSending(false);
    }
  };

  const sendVoice = async (audioBase64: string) => {
    setIsSending(true);
    setError('');
    try {
      const context = await ensureBackendContext();
      const response = await submitVoiceAssessment(context.token, context.caseId, messages, audioBase64);
      await finalizeTurn(response, response.transcript);
      if (response.reply_audio_base64) {
        const audio = new Audio(`data:audio/mp3;base64,${response.reply_audio_base64}`);
        audio.play().catch(() => {
          // Audio playback is optional; the written reply is always shown.
        });
      }
    } catch (voiceError) {
      const message = voiceError instanceof Error ? voiceError.message : 'Unable to process your voice message.';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  const startRecording = async () => {
    if (isSending || isComplete || isRecording) return;
    if (!voiceSupported) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge, or type your answer instead.');
      return;
    }
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const base64 = await blobToBase64(blob);
          await sendVoice(base64);
        } catch (readError) {
          const message = readError instanceof Error ? readError.message : 'Could not read the recording.';
          setError(message);
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access was denied. Please allow the microphone or type your answer instead.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eceef0] gap-3">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('screening-intro', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Screening Intro</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">Conversational Assessment</span>
        </div>

        {/* Collected Fields Progress */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${
            allCollected ? 'bg-emerald-100 text-emerald-900' : 'bg-[#d6e3ff] text-[#002046]'
          }`}>
            {allCollected ? '✓ ALL SIGNALS COLLECTED' : `${collectedCount}/${REQUIRED_FIELD_COUNT} SIGNALS COLLECTED`}
          </span>
        </div>
      </div>

      {/* Pipeline Layers Notice */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg bg-[#f2f4f8] border border-[#c4c6cf]/70 text-[11px] text-[#545f72]">
        <span className="flex items-center gap-1.5 font-bold text-[#002046] whitespace-nowrap">
          <span className="material-symbols-outlined text-sm">account_tree</span>
          ASSESSMENT PIPELINE:
        </span>
        <span className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-[#002046]">OpenAI Conversational Assessment</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
          <span className="font-semibold text-[#002046]">Structured Signal Extraction</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
          <span className="font-semibold text-[#002046]">RakshaSetu ML Risk Engine</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
          <span className="font-semibold text-emerald-800">Human Counsellor Review</span>
        </span>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-[#c4c6cf] shadow-sm overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-[#002046] text-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">psychology_alt</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">RakshaSetu Assessment Companion</p>
            <p className="text-[11px] text-[#aec7f7]">Short adaptive conversation • Type or speak 🎤 • Your answers stay private</p>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {voiceSupported ? 'VOICE + TEXT' : 'TEXT'}
          </span>
        </div>

        {/* Messages */}
        <div className="h-[26rem] overflow-y-auto px-4 sm:px-6 py-5 space-y-4 bg-[#f7f9fb]">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex items-end gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#d6e3ff] text-[#002046] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">psychology</span>
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                  message.role === 'user'
                    ? 'bg-[#002046] text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-[#191c1e] border border-[#c4c6cf]/70 rounded-2xl rounded-bl-md'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#002046]/10 text-[#002046] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">person</span>
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#d6e3ff] text-[#002046] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">psychology</span>
              </div>
              <div className="px-4 py-3 bg-white border border-[#c4c6cf]/70 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#002046]/40 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#002046]/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#002046]/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">mic</span>
              </div>
              <div className="px-4 py-3 bg-[#fff0f0] border border-[#ba1a1a]/40 rounded-2xl rounded-bl-md flex items-center gap-2 text-xs font-semibold text-[#93000a]">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                <span>Listening… speak now</span>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-semibold">
              <span className="material-symbols-outlined text-base">fact_check</span>
              Assessment complete — structured signals extracted and sent to the RakshaSetu ML engine. Loading your result…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Safety Signal Banner */}
        {safetySignal && !isComplete && (
          <div className="px-5 py-2.5 bg-[#fff0f0] border-t border-[#ba1a1a]/40 text-xs text-[#93000a] flex items-start gap-2">
            <span className="material-symbols-outlined text-base shrink-0">emergency</span>
            <span>
              <strong>You are not alone.</strong> If you are in immediate danger, please call <strong>Tele-MANAS 24x7: 14416</strong> right now. A counsellor has been flagged for human review.
            </span>
          </div>
        )}

        {error && (
          <div className="px-5 py-2.5 bg-[#fff0f0] border-t border-[#ba1a1a]/40 text-xs text-[#93000a]" role="alert">
            <strong>Unable to respond:</strong> {error}
          </div>
        )}

        {/* Input */}
        <div className="p-3.5 border-t border-[#eceef0] bg-white flex items-end gap-2.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            disabled={isSending || isComplete || isRecording}
            placeholder={isComplete ? 'Assessment complete — redirecting to your result…' : 'Type your response… (Enter to send, Shift+Enter for a new line)'}
            className="flex-1 p-3 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046] disabled:opacity-60 resize-none"
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isSending || isComplete}
            title={voiceSupported ? (isRecording ? 'Stop recording' : 'Speak your answer (OpenAI voicebot)') : 'Voice not supported in this browser'}
            className={`px-3 py-3 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording
                ? 'bg-[#ba1a1a] text-white animate-pulse'
                : 'bg-[#f2f4f6] text-[#002046] border border-[#c4c6cf] hover:bg-[#d6e3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">{isRecording ? 'stop' : 'mic'}</span>
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || isComplete || isRecording || !input.trim()}
            className="px-5 py-3 bg-[#002046] hover:bg-[#1b365d] text-white text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">{isSending ? 'Thinking…' : 'Send'}</span>
            <span className="material-symbols-outlined text-base">{isSending ? 'progress_activity' : 'send'}</span>
          </button>
        </div>
      </div>

      {/* Collected signals chips */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-[#545f72] font-semibold mr-1">Collected signals:</span>
        {Object.entries(FIELD_LABELS).map(([key, label]) => {
          const collected = collectedFields.includes(key);
          return (
            <span
              key={key}
              className={`px-2 py-0.5 rounded-full font-mono border ${
                collected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {collected ? '✓' : '○'} {label}
            </span>
          );
        })}
      </div>

      <div className="mt-6">
        <EthicsBanner type="ai-preliminary" />
      </div>
    </div>
  );
};

export default ScreeningChat;