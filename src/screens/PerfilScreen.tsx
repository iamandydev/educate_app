import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import Boton from '../components/Boton';

interface PerfilScreenProps {
  profileName: string | null;
  profileColor: string;
  onEnter: () => void;
  onAddProfile: () => void;
  onSettings: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const PerfilScreen: React.FC<PerfilScreenProps> = ({
  profileName,
  profileColor,
  onEnter,
  onAddProfile,
  onSettings,
}) => {
  const hasProfile = profileName !== null && profileName.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {hasProfile ? (
        <TouchableOpacity
          style={[styles.bubble, { backgroundColor: profileColor }]}
          activeOpacity={0.8}
        >
          <Text style={styles.initials}>{getInitials(profileName!)}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.bubble, styles.addBubble]}
          onPress={onAddProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      )}

      {hasProfile && (
        <Text style={styles.profileName}>{profileName}</Text>
      )}

      {hasProfile && (
        <Boton title="Entrar" onPress={onEnter} style={styles.enterButton} />
      )}

      {!hasProfile && (
        <Text style={styles.hintText}>Toca el + para añadir un perfil</Text>
      )}

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettings}
        activeOpacity={0.8}
      >
        <Image
          source={require('../icons/favicon-96x96.png')}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkGreen,
    marginBottom: 40,
    textAlign: 'center',
    position: 'absolute',
    top: 60,
  },
  bubble: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addBubble: {
    borderWidth: 3,
    borderColor: COLORS.mediumGreen,
    borderStyle: 'dashed',
    backgroundColor: COLORS.white,
  },
  addIcon: {
    fontSize: 50,
    fontWeight: '300',
    color: COLORS.mediumGreen,
  },
  initials: {
    fontSize: 44,
    fontWeight: '700',
    color: COLORS.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 30,
  },
  enterButton: {
    width: '100%',
    maxWidth: 280,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 10,
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 26,
    height: 26,
    tintColor: COLORS.darkGray,
  },
});

export default PerfilScreen;
