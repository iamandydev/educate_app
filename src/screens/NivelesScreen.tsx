import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/colors';
import ScreenHeader from '../components/ScreenHeader';
import { saveNiveles, loadNiveles } from '../storage/storageService';
import { getNiveles } from '../services/api';
import { isConnected } from '../services/connectivity';
import type { ProfileData, Leccion, Nivel } from '../types';

interface NivelesScreenProps {
  leccion: Leccion;
  profile: ProfileData;
  onBack: () => void;
  onSelectNivel: (nivel: Nivel) => void;
}

const NivelesScreen: React.FC<NivelesScreenProps> = ({ leccion, profile, onBack, onSelectNivel }) => {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const cached = await loadNiveles(leccion.id, profile.codigo);
        if (cached.length > 0) {
          setNiveles(cached);
        }

        const onlineNow = await isConnected();
        if (onlineNow) {
          const response = await getNiveles(leccion.id);
          if (response.status === 'success' && response.data) {
            setNiveles(response.data);
            await saveNiveles(leccion.id, response.data, profile.codigo);
          }
        }
      } catch {
        const cached = await loadNiveles(leccion.id, profile.codigo);
        if (cached.length > 0) {
          setNiveles(cached);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNiveles();
  }, [leccion.id, profile.codigo]);

  const reversedNiveles = useMemo(() => [...niveles].sort((a, b) => b.orden - a.orden || b.id - a.id), [niveles]);

  const renderNivel = ({ item, index }: { item: Nivel; index: number }) => {
    const displayNumber = reversedNiveles.length - index;
    return (
      <TouchableOpacity style={styles.nivelCard} activeOpacity={0.8} onPress={() => onSelectNivel(item)}>
        <View style={styles.nivelNumber}>
          <Text style={styles.nivelNumberText}>{displayNumber}</Text>
        </View>
        <View style={styles.nivelInfo}>
          <Text style={styles.nivelTitle}>{item.titulo}</Text>
          <Text style={styles.nivelObjetivo} numberOfLines={2}>{item.objetivo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={leccion.titulo} onBack={onBack} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.mediumGreen} />
          <Text style={styles.loadingText}>Cargando niveles...</Text>
        </View>
      ) : reversedNiveles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay niveles disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={reversedNiveles}
          renderItem={renderNivel}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.gray },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.gray },
  listContent: { paddingHorizontal: 24, paddingBottom: 20 },
  nivelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  nivelNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.mediumGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nivelNumberText: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  nivelInfo: { flex: 1 },
  nivelTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkGreen, marginBottom: 4 },
  nivelObjetivo: { fontSize: 13, color: COLORS.darkGray, lineHeight: 18 },
});

export default NivelesScreen;
