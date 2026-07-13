import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import Boton from '../components/Boton';
import { saveAsignacion } from '../storage/storageService';

interface AsignacionScreenProps {
  onNext: () => void;
}

const AsignacionScreen: React.FC<AsignacionScreenProps> = ({ onNext }) => {
  const [docente, setDocente] = useState('');
  const [salon, setSalon] = useState('');
  const [dispositivo, setDispositivo] = useState('');

  const handleSubmit = async () => {
    await saveAsignacion({ docente, salon, dispositivo });
    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Asignación</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Docente</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del docente"
              placeholderTextColor={COLORS.gray}
              value={docente}
              onChangeText={setDocente}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Salón</Text>
            <TextInput
              style={styles.input}
              placeholder="Número o nombre del salón"
              placeholderTextColor={COLORS.gray}
              value={salon}
              onChangeText={setSalon}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dispositivo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del dispositivo"
              placeholderTextColor={COLORS.gray}
              value={dispositivo}
              onChangeText={setDispositivo}
            />
          </View>
        </View>

        <Boton title="Siguiente" onPress={handleSubmit} style={styles.button} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGreen,
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
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
    marginTop: 40,
  },
});

export default AsignacionScreen;
