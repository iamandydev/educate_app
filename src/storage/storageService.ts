import RNFS from 'react-native-fs';

const USER_DATA_DIR = 'user_data';

function getUserDataPath(): string {
  return `${RNFS.DocumentDirectoryPath}/${USER_DATA_DIR}`;
}

function getAsignacionPath(): string {
  return `${getUserDataPath()}/asignacion.json`;
}

function getProfilePath(name: string): string {
  return `${getUserDataPath()}/${name}`;
}

function getProfileJsonPath(name: string): string {
  return `${getProfilePath(name)}/perfil.json`;
}

export interface AsignacionData {
  docente: string;
  salon: string;
  dispositivo: string;
}

export interface PerfilData {
  nombre: string;
  color: string;
}

async function ensureDir(dirPath: string): Promise<void> {
  const exists = await RNFS.exists(dirPath);
  if (!exists) {
    await RNFS.mkdir(dirPath);
  }
}

export async function saveAsignacion(data: AsignacionData): Promise<void> {
  await ensureDir(getUserDataPath());
  const json = JSON.stringify(data, null, 2);
  await RNFS.writeFile(getAsignacionPath(), json, 'utf8');
}

export async function savePerfil(name: string, color: string): Promise<void> {
  const profileDir = getProfilePath(name);
  await ensureDir(profileDir);
  const data: PerfilData = { nombre: name, color };
  const json = JSON.stringify(data, null, 2);
  await RNFS.writeFile(getProfileJsonPath(name), json, 'utf8');
}
