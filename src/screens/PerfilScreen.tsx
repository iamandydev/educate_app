import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import ScreenHeader from '../components/ScreenHeader';
import { deleteProfileData } from '../storage/storageService';
import type { ProfileData } from '../types';

interface PerfilScreenProps {
  profiles: ProfileData[];
  onSelectProfile: (profile: ProfileData) => void;
  onAddProfile: () => void;
  onSettings: () => void;
  onProfilesChanged: (profiles: ProfileData[]) => void;
  onAllProfilesRemoved: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) { return ''; }
  if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const PerfilScreen: React.FC<PerfilScreenProps> = ({
  profiles,
  onSelectProfile,
  onAddProfile,
  onSettings,
  onProfilesChanged,
  onAllProfilesRemoved,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const menuRef = useRef<View>(null);

  const handleLogoutPress = () => {
    setMenuVisible(false);
    if (profiles.length === 0) { return; }
    setLogoutModalVisible(true);
  };

  const handleSelectProfileToDelete = (profile: ProfileData) => {
    setLogoutModalVisible(false);
    Alert.alert(
      'Cerrar sesión',
      `¿Eliminar el perfil de ${profile.nombre_completo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteProfileData(profile.codigo);
            const updated = profiles.filter((p) => p.codigo !== profile.codigo);
            if (updated.length === 0) {
              onAllProfilesRemoved();
            } else {
              onProfilesChanged(updated);
            }
          },
        },
      ],
    );
  };

  const handleSettingsPress = () => {
    setMenuVisible(false);
    onSettings();
  };

  const threeDots = (
    <TouchableOpacity
      ref={menuRef}
      style={styles.menuButton}
      onPress={() => setMenuVisible(!menuVisible)}
      activeOpacity={0.7}
    >
      <Text style={styles.menuDots}>{'\u22EE'}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ProfileData | 'add' }) => {
    if (item === 'add') {
      return (
        <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8} onPress={onAddProfile}>
          <View style={[styles.bubble, styles.addBubble]}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.addLabel}>Añadir</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8} onPress={() => onSelectProfile(item)}>
        <View style={[styles.bubble, { backgroundColor: item.color }]}>
          <Text style={styles.initials}>{getInitials(item.nombre_completo)}</Text>
        </View>
        <Text style={styles.profileName} numberOfLines={1}>{item.nombre_completo}</Text>
      </TouchableOpacity>
    );
  };

  const data: (ProfileData | 'add')[] = [...profiles, 'add'];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Perfil" rightElement={threeDots} />

      {menuVisible && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setMenuVisible(false)} activeOpacity={1} />
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogoutPress} activeOpacity={0.7}>
              <Text style={styles.dropdownItemText}>Cerrar sesion</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity style={styles.dropdownItem} onPress={handleSettingsPress} activeOpacity={0.7}>
              <Text style={styles.dropdownItemText}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => (item === 'add' ? 'add' : item.codigo)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      {profiles.length === 0 && (
        <Text style={styles.hintText}>Toca el + para anadir un perfil</Text>
      )}

      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el perfil a cerrar</Text>
            <View style={styles.modalProfiles}>
              {profiles.map((profile) => (
                <TouchableOpacity
                  key={profile.codigo}
                  style={styles.modalProfileItem}
                  onPress={() => handleSelectProfileToDelete(profile)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.modalBubble, { backgroundColor: profile.color }]}>
                    <Text style={styles.modalInitials}>{getInitials(profile.nombre_completo)}</Text>
                  </View>
                  <Text style={styles.modalProfileName}>{profile.nombre_completo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setLogoutModalVisible(false)} activeOpacity={0.7}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, alignItems: 'center', paddingVertical: 20 },
  itemContainer: { alignItems: 'center', marginHorizontal: 12 },
  bubble: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  addBubble: { borderWidth: 3, borderColor: COLORS.mediumGreen, borderStyle: 'dashed', backgroundColor: COLORS.white },
  addIcon: { fontSize: 50, fontWeight: '300', color: COLORS.mediumGreen },
  initials: { fontSize: 44, fontWeight: '700', color: COLORS.white },
  profileName: { fontSize: 16, fontWeight: '600', color: COLORS.darkGray, maxWidth: 130 },
  addLabel: { fontSize: 16, fontWeight: '600', color: COLORS.mediumGreen },
  hintText: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 20 },
  menuButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
  menuDots: { fontSize: 22, color: COLORS.darkGray, fontWeight: '700' },
  dropdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
  dropdownBackdrop: { flex: 1 },
  dropdown: { position: 'absolute', top: 88, right: 16, backgroundColor: COLORS.white, borderRadius: 12, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, minWidth: 180, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 20 },
  dropdownItemText: { fontSize: 16, color: COLORS.darkGray, fontWeight: '500' },
  dropdownDivider: { height: 1, backgroundColor: COLORS.lightGray },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '85%', maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.darkGreen, textAlign: 'center', marginBottom: 24 },
  modalProfiles: { gap: 16 },
  modalProfileItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: COLORS.lightGray },
  modalBubble: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  modalInitials: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  modalProfileName: { fontSize: 17, fontWeight: '600', color: COLORS.darkGray },
  modalCancel: { marginTop: 20, paddingVertical: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: COLORS.gray },
});

export default PerfilScreen;
