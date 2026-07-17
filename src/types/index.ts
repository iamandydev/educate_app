export interface ProfileData {
  id: number;
  codigo: string;
  nombre_completo: string;
  curso: string;
  curso_id: number;
  color: string;
}

export interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  fecha_limite: string | null;
  tiempo_limite_minutos: number | null;
  estado: number;
  created_at: string;
}

export interface Nivel {
  id: number;
  titulo: string;
  objetivo: string;
  orden: number;
  estado: number;
  created_at: string;
}

export interface Pregunta {
  id: number;
  opciones: string[];
  respuesta_correcta: string;
  created_at: string;
}

export interface NivelDetalle extends Nivel {
  leccion_id: number;
  pregunta: Pregunta;
}

export interface PendingAnswer {
  id: string;
  nivelId: number;
  codigo: string;
  respuesta: string;
  tiempoSegundos: number;
  timestamp: number;
}
