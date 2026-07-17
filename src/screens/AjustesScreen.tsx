import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import ScreenHeader from '../components/ScreenHeader';

interface AjustesScreenProps {
  onBack: () => void;
}

const AjustesScreen: React.FC<AjustesScreenProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Ajustes" onBack={onBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre de la app</Text>
          <Text style={styles.value}>Educate</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  card: { backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.gray, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '600', color: COLORS.darkGray },
});

export default AjustesScreen;
