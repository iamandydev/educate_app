import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import Boton from '../components/Boton';
import { savePerfil } from '../storage/storageService';

const BUBBLE_COLORS = [
  '#bc4749',
  '#386641',
  '#6a994e',
  '#a7c957',
  '#E76F51',
  '#264653',
  '#2A9D8F',
  '#E9C46A',
  '#F4A261',
  '#8338EC',
];

function getRandomColor(): string {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || name.trim() === '') return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface AnadirPerfilScreenProps {
  onNext: (name: string, color: string) => void;
}

const AnadirPerfilScreen: React.FC<AnadirPerfilScreenProps> = ({ onNext }) => {
  const [nombre, setNombre] = useState('');
  const bubbleColor = useMemo(() => getRandomColor(), []);

  const initials = useMemo(() => getInitials(nombre), [nombre]);

  const handleSubmit = async () => {
    await savePerfil(nombre, bubbleColor);
    onNext(nombre, bubbleColor);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Añadir perfil</Text>

        <View style={[styles.bubble, { backgroundColor: bubbleColor }]}>
          <Text style={styles.initials}>
            {initials || '?'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre del Alumno</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre"
            placeholderTextColor={COLORS.gray}
            value={nombre}
            onChangeText={setNombre}
            autoFocus
          />
        </View>

        <Boton
          title="Siguiente"
          onPress={handleSubmit}
          style={styles.button}
          disabled={nombre.trim().length === 0}
        />
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
    marginBottom: 40,
    textAlign: 'center',
  },
  bubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  initials: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.white,
  },
  field: {
    width: '100%',
    gap: 8,
    marginBottom: 40,
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
  button: {
    width: '100%',
  },
});

export default AnadirPerfilScreen;
