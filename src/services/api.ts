import type { Leccion, Nivel, NivelDetalle } from '../types';

const API_BASE_URL = __DEV__
  ? 'http://localhost/educate_api'
  : 'https://api-educate.byethost31.com';

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
  const response = await fetch(`${API_BASE_URL}/auth/alumno/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo,
      numero_identificacion: identificacion,
    }),
  });
  return response.json();
}

export async function getStudentByCodigo(
  codigo: string,
): Promise<StudentDataResponse> {
  const response = await fetch(`${API_BASE_URL}/alumnos/${codigo}`);
  return response.json();
}

export async function getLecciones(cursoId: number): Promise<LeccionesResponse> {
  const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}/lecciones`);
  return response.json();
}

export async function getNiveles(leccionId: number): Promise<NivelesResponse> {
  const response = await fetch(`${API_BASE_URL}/lecciones/${leccionId}/niveles`);
  return response.json();
}

export async function getNivelDetalle(
  leccionId: number,
  nivelId: number,
): Promise<NivelDetalleResponse> {
  const response = await fetch(
    `${API_BASE_URL}/lecciones/${leccionId}/niveles/${nivelId}`,
  );
  return response.json();
}

export async function responderNivel(
  nivelId: number,
  codigo: string,
  respuesta: string,
  tiempoSegundos: number,
): Promise<ResponderResponse> {
  const response = await fetch(`${API_BASE_URL}/niveles/${nivelId}/responder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo_alumno: codigo,
      respuesta,
      tiempo_segundos: tiempoSegundos,
    }),
  });
  return response.json();
}
