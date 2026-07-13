declare const localStorage: {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const USER_DATA_PREFIX = 'user_data';

export interface AsignacionData {
  docente: string;
  salon: string;
  dispositivo: string;
}

export interface PerfilData {
  nombre: string;
  color: string;
}

export async function saveAsignacion(data: AsignacionData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/asignacion.json`, json);
}

export async function savePerfil(name: string, color: string): Promise<void> {
  const data: PerfilData = { nombre: name, color };
  const json = JSON.stringify(data, null, 2);
  localStorage.setItem(`${USER_DATA_PREFIX}/${name}/perfil.json`, json);
}
