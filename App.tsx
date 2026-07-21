import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import AjustesScreen from './src/screens/AjustesScreen';
import HomeScreen from './src/screens/HomeScreen';
import NivelesScreen from './src/screens/NivelesScreen';
import QuizScreen from './src/screens/QuizScreen';
import { loadProfiles, saveProfiles } from './src/storage/storageService';
import { onConnectivityChange } from './src/services/connectivity';
import { syncPendingAnswers } from './src/services/syncQueue';
import type { ProfileData, Leccion, Nivel } from './src/types';

type Screen = 'loading' | 'login' | 'perfil' | 'ajustes' | 'home' | 'niveles' | 'quiz';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Leccion | null>(null);
  const [selectedNivel, setSelectedNivel] = useState<Nivel | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const loaded = await loadProfiles();
      setProfiles(loaded);
      setCurrentScreen(loaded.length > 0 ? 'perfil' : 'login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onConnectivityChange((connected) => {
      if (connected) {
        syncPendingAnswers();
      }
    });
    syncPendingAnswers();
    return unsubscribe;
  }, []);

  const handleLoginSuccess = useCallback(async (profile: ProfileData) => {
    setProfiles((prev) => {
      if (prev.some((p) => p.codigo === profile.codigo)) { return prev; }
      const updated = [...prev, profile];
      saveProfiles(updated);
      return updated;
    });
    setCurrentScreen('perfil');
  }, []);

  const handleSelectProfile = useCallback((profile: ProfileData) => {
    setSelectedProfile(profile);
    setCurrentScreen('home');
  }, []);

  const handleAddProfile = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  const handleSettings = useCallback(() => {
    setCurrentScreen('ajustes');
  }, []);

  const handleProfilesChanged = useCallback((updated: ProfileData[]) => {
    setProfiles(updated);
    saveProfiles(updated);
  }, []);

  const handleAllProfilesRemoved = useCallback(() => {
    setProfiles([]);
    setCurrentScreen('login');
  }, []);

  const handleBackFromAjustes = useCallback(() => {
    setCurrentScreen('perfil');
  }, []);

  const handleBackFromHome = useCallback(() => {
    setSelectedProfile(null);
    setCurrentScreen('perfil');
  }, []);

  const handleSelectLesson = useCallback((leccion: Leccion) => {
    setSelectedLesson(leccion);
    setCurrentScreen('niveles');
  }, []);

  const handleBackFromNiveles = useCallback(() => {
    setSelectedLesson(null);
    setCurrentScreen('home');
  }, []);

  const handleSelectNivel = useCallback((nivel: Nivel) => {
    setSelectedNivel(nivel);
    setCurrentScreen('quiz');
  }, []);

  const handleBackFromQuiz = useCallback(() => {
    setSelectedNivel(null);
    setCurrentScreen('niveles');
  }, []);

  const handleQuizComplete = useCallback(() => {
    setSelectedNivel(null);
    setSelectedLesson(null);
    setCurrentScreen('home');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'login' && (
        <LoginScreen existingProfiles={profiles} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentScreen === 'perfil' && (
        <PerfilScreen
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onAddProfile={handleAddProfile}
          onSettings={handleSettings}
          onProfilesChanged={handleProfilesChanged}
          onAllProfilesRemoved={handleAllProfilesRemoved}
        />
      )}
      {currentScreen === 'ajustes' && <AjustesScreen onBack={handleBackFromAjustes} />}
      {currentScreen === 'home' && selectedProfile && (
        <HomeScreen
          profile={selectedProfile}
          onBack={handleBackFromHome}
          onSelectLesson={handleSelectLesson}
        />
      )}
      {currentScreen === 'niveles' && selectedLesson && selectedProfile && (
        <NivelesScreen
          leccion={selectedLesson}
          profile={selectedProfile}
          onBack={handleBackFromNiveles}
          onSelectNivel={handleSelectNivel}
        />
      )}
      {currentScreen === 'quiz' && selectedNivel && selectedLesson && selectedProfile && (
        <QuizScreen
          nivel={selectedNivel}
          leccionId={selectedLesson.id}
          profile={selectedProfile}
          onBack={handleBackFromQuiz}
          onComplete={handleQuizComplete}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
