import RNFS from 'react-native-fs';
import type { ProfileData, PendingAnswer, Leccion, Nivel } from '../types';

const USER_DATA_DIR = 'user_data';

function getUserDataPath(): string {
  return `${RNFS.DocumentDirectoryPath}/${USER_DATA_DIR}`;
}

function getProfilesPath(): string {
  return `${getUserDataPath()}/profiles.json`;
}

function getPendingAnswersPath(): string {
  return `${getUserDataPath()}/pending_answers.json`;
}

function getProfileDir(codigo: string): string {
  return `${getUserDataPath()}/${codigo}`;
}

function getCachePath(codigo: string, filename: string): string {
  return `${getProfileDir(codigo)}/${filename}`;
}

async function ensureDir(dirPath: string): Promise<void> {
  const exists = await RNFS.exists(dirPath);
  if (!exists) {
    await RNFS.mkdir(dirPath);
  }
}

async function ensureUserDataDir(): Promise<void> {
  await ensureDir(getUserDataPath());
}

export async function saveProfiles(profiles: ProfileData[]): Promise<void> {
  await ensureUserDataDir();
  const json = JSON.stringify(profiles, null, 2);
  await RNFS.writeFile(getProfilesPath(), json, 'utf8');
}

export async function loadProfiles(): Promise<ProfileData[]> {
  try {
    const exists = await RNFS.exists(getProfilesPath());
    if (!exists) { return []; }
    const raw = await RNFS.readFile(getProfilesPath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveLecciones(codigo: string, lecciones: Leccion[]): Promise<void> {
  const dir = getProfileDir(codigo);
  await ensureDir(dir);
  const json = JSON.stringify(lecciones, null, 2);
  await RNFS.writeFile(getCachePath(codigo, 'lecciones.json'), json, 'utf8');
}

export async function loadLecciones(codigo: string): Promise<Leccion[]> {
  try {
    const path = getCachePath(codigo, 'lecciones.json');
    const exists = await RNFS.exists(path);
    if (!exists) { return []; }
    const raw = await RNFS.readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveNiveles(leccionId: number, niveles: Nivel[], codigo: string): Promise<void> {
  const dir = getProfileDir(codigo);
  await ensureDir(dir);
  const json = JSON.stringify(niveles, null, 2);
  await RNFS.writeFile(getCachePath(codigo, `niveles_${leccionId}.json`), json, 'utf8');
}

export async function loadNiveles(leccionId: number, codigo: string): Promise<Nivel[]> {
  try {
    const path = getCachePath(codigo, `niveles_${leccionId}.json`);
    const exists = await RNFS.exists(path);
    if (!exists) { return []; }
    const raw = await RNFS.readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function savePendingAnswers(answers: PendingAnswer[]): Promise<void> {
  await ensureUserDataDir();
  const json = JSON.stringify(answers, null, 2);
  await RNFS.writeFile(getPendingAnswersPath(), json, 'utf8');
}

export async function loadPendingAnswers(): Promise<PendingAnswer[]> {
  try {
    const exists = await RNFS.exists(getPendingAnswersPath());
    if (!exists) { return []; }
    const raw = await RNFS.readFile(getPendingAnswersPath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function deleteProfileData(codigo: string): Promise<void> {
  const dir = getProfileDir(codigo);
  const exists = await RNFS.exists(dir);
  if (exists) {
    await RNFS.unlink(dir);
  }
  const profiles = await loadProfiles();
  const updated = profiles.filter((p) => p.codigo !== codigo);
  await saveProfiles(updated);
  const pending = await loadPendingAnswers();
  const updatedPending = pending.filter((a) => a.codigo !== codigo);
  await savePendingAnswers(updatedPending);
}
