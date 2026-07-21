import type { Leccion, Nivel, NivelDetalle } from '../types';

const API_BASE_URL = 'http://192.168.20.79/educate_api';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export interface LoginResponse {
  status: string;
  message?: string;
  data?: {
    id: number;
    codigo: string;
    nombre_completo: string;
    curso: string;
  };
}

export interface StudentAlumno {
  id: number;
  codigo: string;
  nombre_completo: string;
  curso: string;
  estado: number;
  created_at: string;
}

export interface StudentCurso {
  id: number;
  nombre: string;
  fecha_inscripcion: string;
}

export interface StudentDataResponse {
  status: string;
  data?: {
    alumno: StudentAlumno;
    cursos: StudentCurso[];
  };
}

export interface LeccionesResponse {
  status: string;
  data?: Leccion[];
}

export interface NivelesResponse {
  status: string;
  data?: Nivel[];
}

export interface NivelDetalleResponse {
  status: string;
  data?: NivelDetalle;
}

export interface ResponderResponse {
  status: string;
  message?: string;
  data?: {
    correcto: boolean;
    respuesta_correcta: string;
    tiempo_segundos: number;
  };
}

export async function loginStudent(
  codigo: string,
  identificacion: string,
): Promise<LoginResponse> {
  return requestJson(`${API_BASE_URL}/auth/alumno/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo,
      numero_identificacion: identificacion,
    }),
  });
}

export async function getStudentByCodigo(
  codigo: string,
): Promise<StudentDataResponse> {
  return requestJson(`${API_BASE_URL}/alumnos/${codigo}`);
}

export async function getLecciones(cursoId: number): Promise<LeccionesResponse> {
  return requestJson(`${API_BASE_URL}/cursos/${cursoId}/lecciones`);
}

export async function getNiveles(leccionId: number): Promise<NivelesResponse> {
  return requestJson(`${API_BASE_URL}/lecciones/${leccionId}/niveles`);
}

export async function getNivelDetalle(
  leccionId: number,
  nivelId: number,
): Promise<NivelDetalleResponse> {
  return requestJson(
    `${API_BASE_URL}/lecciones/${leccionId}/niveles/${nivelId}`,
  );
}

export async function responderNivel(
  nivelId: number,
  codigo: string,
  respuesta: string,
  tiempoSegundos: number,
): Promise<ResponderResponse> {
  return requestJson(`${API_BASE_URL}/niveles/${nivelId}/responder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo_alumno: codigo,
      respuesta,
      tiempo_segundos: tiempoSegundos,
    }),
  });
}
