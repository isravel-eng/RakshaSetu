import { CitizenSession } from '../types';
import { readJson, removeItem, storageKeys, writeJson } from './storage';

export function loadCitizenSession(): CitizenSession | null {
  return readJson<CitizenSession>(storageKeys.session);
}

export function saveCitizenSession(session: CitizenSession): void {
  writeJson(storageKeys.session, session);
}

export function clearCitizenSession(): void {
  removeItem(storageKeys.session);
}

export function createCitizenSession(phone: string, displayName: string): CitizenSession {
  const session: CitizenSession = {
    phone: phone.trim(),
    displayName: displayName.trim(),
    loggedInAt: new Date().toISOString()
  };
  saveCitizenSession(session);
  return session;
}

export function loadConsent(): boolean {
  return readJson<boolean>(storageKeys.consent) === true;
}

export function saveConsent(consented: boolean): void {
  writeJson(storageKeys.consent, consented);
}

export function clearConsent(): void {
  removeItem(storageKeys.consent);
}
