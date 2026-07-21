import { savePendingAnswers, loadPendingAnswers } from '../storage/storageService';
import { isConnected } from './connectivity';
import { responderNivel } from './api';
import type { PendingAnswer } from '../types';

let syncInProgress = false;

export async function addPendingAnswer(
  nivelId: number,
  codigo: string,
  respuesta: string,
  tiempoSegundos: number,
): Promise<void> {
  const answers = await loadPendingAnswers();
  const newAnswer: PendingAnswer = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nivelId,
    codigo,
    respuesta,
    tiempoSegundos,
    timestamp: Date.now(),
  };
  answers.push(newAnswer);
  await savePendingAnswers(answers);
}

export async function syncPendingAnswers(): Promise<void> {
  if (syncInProgress) { return; }
  syncInProgress = true;

  try {
    const online = await isConnected();
    if (!online) { return; }

    const answers = await loadPendingAnswers();
    if (answers.length === 0) { return; }

    const remaining: PendingAnswer[] = [];
    for (const answer of answers) {
      try {
        await responderNivel(
          answer.nivelId,
          answer.codigo,
          answer.respuesta,
          answer.tiempoSegundos,
        );
      } catch {
        remaining.push(answer);
        break;
      }
    }
    await savePendingAnswers(remaining);
  } finally {
    syncInProgress = false;
  }
}
