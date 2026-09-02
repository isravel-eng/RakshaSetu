const PREFIX = 'rakshasetu:';

export const storageKeys = {
  session: `${PREFIX}citizen-session`,
  consent: `${PREFIX}citizen-consent`,
  profile: `${PREFIX}citizen-profile`,
  screening: `${PREFIX}screening-answers`,
  cases: `${PREFIX}cases`
} as const;

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}
