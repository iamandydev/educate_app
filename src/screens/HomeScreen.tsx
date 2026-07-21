import React, { useState, useEffect } from 'react';
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
import { saveLecciones, loadLecciones } from '../storage/storageService';
import { getLecciones } from '../services/api';
import { isConnected } from '../services/connectivity';
import type { ProfileData, Leccion } from '../types';
import { getInitials } from '../utils/getInitials';

interface HomeScreenProps {
  profile: ProfileData;
  onBack: () => void;
  onSelectLesson: (leccion: Leccion) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ profile, onBack, onSelectLesson }) => {
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    isConnected().then(setOnline);
  }, []);

  useEffect(() => {
    const fetchLecciones = async () => {
      try {
        const cached = await loadLecciones(profile.codigo);
        if (cached.length > 0) {
          setLecciones(cached);
        }

        const onlineNow = await isConnected();
        if (onlineNow && profile.curso_id > 0) {
          const response = await getLecciones(profile.curso_id);
          if (response.status === 'success' && response.data) {
            setLecciones(response.data);
            await saveLecciones(profile.codigo, response.data);
          }
        }
      } catch {
        const cached = await loadLecciones(profile.codigo);
        if (cached.length > 0) {
          setLecciones(cached);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLecciones();
  }, [profile.codigo, profile.curso_id]);

  const profileBubble = (
    <View style={[styles.profileBubble, { backgroundColor: profile.color }]}>
      <Text style={styles.profileInitials}>{getInitials(profile.nombre_completo)}</Text>
    </View>
  );

  const renderLeccion = ({ item }: { item: Leccion }) => (
    <TouchableOpacity style={styles.lessonCard} activeOpacity={0.8} onPress={() => onSelectLesson(item)}>
      <Text style={styles.lessonTitle}>{item.titulo}</Text>
      <Text style={styles.lessonDesc} numberOfLines={2}>{item.descripcion}</Text>
      {item.tiempo_limite_minutos && (
        <Text style={styles.lessonTime}>{item.tiempo_limite_minutos} min</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mis lecciones" onBack={onBack} rightElement={profileBubble} />

      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: online ? COLORS.mediumGreen : COLORS.red }]} />
        <Text style={styles.statusText}>{online ? 'En linea' : 'Sin conexion'}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.mediumGreen} />
          <Text style={styles.loadingText}>Cargando lecciones...</Text>
        </View>
      ) : lecciones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay lecciones disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={lecciones}
          renderItem={renderLeccion}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  profileBubble: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  profileInitials: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  statusBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 13, color: COLORS.gray },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.gray },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.gray },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  lessonCard: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
  },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkGreen, marginBottom: 6 },
  lessonDesc: { fontSize: 13, color: COLORS.darkGray, lineHeight: 18 },
  lessonTime: { fontSize: 12, color: COLORS.mediumGreen, fontWeight: '600', marginTop: 8 },
});

export default HomeScreen;
