import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getNivelDetalle, responderNivel } from '../services/api';
import { isConnected } from '../services/connectivity';
import { addPendingAnswer } from '../services/syncQueue';
import type { ProfileData, Nivel, NivelDetalle } from '../types';

interface QuizScreenProps {
  nivel: Nivel;
  leccionId: number;
  profile: ProfileData;
  onBack: () => void;
  onComplete: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ nivel, leccionId, profile, onBack, onComplete }) => {
  const [detalle, setDetalle] = useState<NivelDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await getNivelDetalle(leccionId, nivel.id);
        if (response.status === 'success' && response.data) {
          setDetalle(response.data);
        }
      } catch {
        // keep null
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [leccionId, nivel.id]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const getSelectedLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const handleResponder = async () => {
    if (selectedIndex === null || !detalle) { return; }

    const tiempoSegundos = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const respuesta = getSelectedLetter(selectedIndex);

    setSubmitting(true);

    try {
      const online = await isConnected();
      if (online) {
        const response = await responderNivel(
          nivel.id,
          profile.codigo,
          respuesta,
          tiempoSegundos,
        );
        if (response.status === 'success' && response.data) {
          const esCorrecta = response.data.correcto;
          const correcta = response.data.respuesta_correcta;
          Alert.alert(
            esCorrecta ? '¡Correcto!' : 'Incorrecto',
            esCorrecta
              ? `¡Bien hecho! Tiempo: ${tiempoSegundos}s`
              : `La respuesta correcta era: ${correcta}. Tiempo: ${tiempoSegundos}s`,
            [{ text: 'OK', onPress: onComplete }],
          );
          return;
        }
      }

      await addPendingAnswer(nivel.id, profile.codigo, respuesta, tiempoSegundos);
      Alert.alert(
        'Respuesta guardada',
        `Tu respuesta sera enviada cuando haya conexion. Tiempo: ${tiempoSegundos}s`,
        [{ text: 'OK', onPress: onComplete }],
      );
    } catch {
      await addPendingAnswer(nivel.id, profile.codigo, respuesta, tiempoSegundos);
      Alert.alert(
        'Respuesta guardada',
        `Tu respuesta sera enviada cuando haya conexion. Tiempo: ${tiempoSegundos}s`,
        [{ text: 'OK', onPress: onComplete }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={nivel.titulo} onBack={onBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.mediumGreen} />
          <Text style={styles.loadingText}>Cargando pregunta...</Text>
        </View>
      </View>
    );
  }

  if (!detalle || !detalle.pregunta) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={nivel.titulo} onBack={onBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No se pudo cargar la pregunta</Text>
        </View>
      </View>
    );
  }

  const opciones = detalle.pregunta.opciones;

  return (
    <View style={styles.container}>
      <ScreenHeader title={nivel.titulo} onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.objetivo}>{detalle.objetivo}</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Pregunta</Text>
          <Text style={styles.questionText}>
            Selecciona la opcion correcta:
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {opciones.map((opcion, index) => {
            const letter = getSelectedLetter(index);
            const isSelected = selectedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionCard, isSelected && styles.optionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedIndex(index)}
                disabled={submitting}
              >
                <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                  <Text style={[styles.optionLetterText, isSelected && styles.optionLetterTextSelected]}>
                    {letter}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.responderButton, (selectedIndex === null || submitting) && styles.responderDisabled]}
          onPress={handleResponder}
          disabled={selectedIndex === null || submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.responderText}>Responder</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.gray },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  objetivo: { fontSize: 15, color: COLORS.darkGray, marginBottom: 20, textAlign: 'center', fontStyle: 'italic' },
  questionContainer: { marginBottom: 24 },
  questionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.mediumGreen, marginBottom: 6, textTransform: 'uppercase' },
  questionText: { fontSize: 18, fontWeight: '600', color: COLORS.darkGreen, lineHeight: 24 },
  optionsContainer: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: COLORS.mediumGreen, backgroundColor: '#F0F8E8' },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  optionLetterSelected: { borderColor: COLORS.mediumGreen, backgroundColor: COLORS.mediumGreen },
  optionLetterText: { fontSize: 15, fontWeight: '700', color: COLORS.darkGray },
  optionLetterTextSelected: { color: COLORS.white },
  optionText: { flex: 1, fontSize: 16, color: COLORS.darkGray },
  optionTextSelected: { color: COLORS.darkGreen, fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingBottom: 30, paddingTop: 10 },
  responderButton: {
    backgroundColor: COLORS.mediumGreen,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  responderDisabled: { opacity: 0.5 },
  responderText: { fontSize: 17, fontWeight: '700', color: COLORS.white },
});

export default QuizScreen;
