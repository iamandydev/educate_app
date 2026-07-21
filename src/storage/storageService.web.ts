import type { ProfileData, PendingAnswer, Leccion, Nivel } from '../types';

declare const localStorage: {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
};

const USER_DATA_PREFIX = 'user_data';

export async function saveProfiles(profiles: ProfileData[]): Promise<void> {
  const json = JSON.stringify(profiles, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/profiles.json`, json);
}

export async function loadProfiles(): Promise<ProfileData[]> {
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}/profiles.json`);
    if (!raw) { return []; }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveLecciones(codigo: string, lecciones: Leccion[]): Promise<void> {
  const json = JSON.stringify(lecciones, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/${codigo}/lecciones.json`, json);
}

export async function loadLecciones(codigo: string): Promise<Leccion[]> {
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}/${codigo}/lecciones.json`);
    if (!raw) { return []; }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveNiveles(leccionId: number, niveles: Nivel[], codigo: string): Promise<void> {
  const json = JSON.stringify(niveles, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/${codigo}/niveles_${leccionId}.json`, json);
}

export async function loadNiveles(leccionId: number, codigo: string): Promise<any[]> {
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}/${codigo}/niveles_${leccionId}.json`);
    if (!raw) { return []; }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function savePendingAnswers(answers: PendingAnswer[]): Promise<void> {
  const json = JSON.stringify(answers, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/pending_answers.json`, json);
}

export async function loadPendingAnswers(): Promise<PendingAnswer[]> {
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}/pending_answers.json`);
    if (!raw) { return []; }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function deleteProfileData(codigo: string): Promise<void> {
  const profiles = await loadProfiles();
  const updated = profiles.filter((p) => p.codigo !== codigo);
  await saveProfiles(updated);
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${USER_DATA_PREFIX}/${codigo}/`)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  const pending = await loadPendingAnswers();
  const updatedPending = pending.filter((a) => a.codigo !== codigo);
  await savePendingAnswers(updatedPending);
}
