import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/colors';
import Boton from '../components/Boton';
import { loginStudent, getStudentByCodigo } from '../services/api';
import { getRandomColor } from '../constants/profileColors';
import type { ProfileData } from '../types';

interface LoginScreenProps {
  existingProfiles: ProfileData[];
  onLoginSuccess: (profile: ProfileData) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ existingProfiles, onLoginSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [codigo, setCodigo] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (codigo.trim().length === 0) {
      setError('Ingresa tu código de estudiante');
      return;
    }
    if (existingProfiles.some((p) => p.codigo === codigo.trim())) {
      setError('Este código ya tiene una sesión iniciada');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleLogin = async () => {
    if (identificacion.trim().length === 0) {
      setError('Ingresa tu número de identificación');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const loginResponse = await loginStudent(codigo.trim(), identificacion.trim());

      if (loginResponse.status !== 'success' || !loginResponse.data) {
        setError(loginResponse.message || 'Código o identificación incorrectos');
        setLoading(false);
        return;
      }

      const studentData = await getStudentByCodigo(codigo.trim());

      const nombre = studentData.data?.alumno?.nombre_completo || loginResponse.data.nombre_completo;
      const curso = studentData.data?.alumno?.curso || loginResponse.data.curso;
      const cursoId = studentData.data?.cursos?.[0]?.id || 0;

      const color = getRandomColor();

      const profile: ProfileData = {
        id: loginResponse.data.id,
        codigo: loginResponse.data.codigo,
        nombre_completo: nombre,
        curso,
        curso_id: cursoId,
        color,
      };

      onLoginSuccess(profile);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
    setIdentificacion('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar sesión</Text>

        {step === 1 ? (
          <>
            <Text style={styles.subtitle}>Ingresa tu código de estudiante</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Código</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: ABC123"
                placeholderTextColor={COLORS.gray}
                value={codigo}
                onChangeText={(text) => { setCodigo(text); setError(''); }}
                autoCapitalize="characters"
                autoFocus
              />
            </View>

            {error.length > 0 && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Boton
              title="Siguiente"
              onPress={handleNext}
              style={styles.button}
              disabled={codigo.trim().length === 0}
            />
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Identificación para el código:</Text>
            <Text style={styles.codigoDisplay}>{codigo}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Número de identificación</Text>
              <TextInput
                style={styles.input}
                placeholder="Número de identificación"
                placeholderTextColor={COLORS.gray}
                value={identificacion}
                onChangeText={(text) => { setIdentificacion(text); setError(''); }}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            {error.length > 0 && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.mediumGreen} />
                <Text style={styles.loadingText}>Iniciando sesión...</Text>
              </View>
            ) : (
              <View style={styles.buttonGroup}>
                <Boton
                  title="Volver"
                  onPress={handleBack}
                  variant="outline"
                  style={styles.backButton}
                />
                <Boton
                  title="Iniciar sesión"
                  onPress={handleLogin}
                  style={styles.loginButton}
                  disabled={identificacion.trim().length === 0}
                />
              </View>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 30,
    textAlign: 'center',
  },
  codigoDisplay: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mediumGreen,
    marginBottom: 30,
  },
  field: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.black,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    flex: 1,
  },
  loginButton: {
    flex: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default LoginScreen;
