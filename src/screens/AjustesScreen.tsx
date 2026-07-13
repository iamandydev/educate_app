import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import Boton from '../components/Boton';

interface AjustesScreenProps {
  onBack: () => void;
}

const AjustesScreen: React.FC<AjustesScreenProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de la app</Text>
        <Text style={styles.value}>Educate</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Versión</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      <Boton title="Volver" onPress={onBack} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGreen,
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  button: {
    marginTop: 40,
  },
});

export default AjustesScreen;
