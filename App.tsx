import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import LoadingScreen from './src/screens/LoadingScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import AnadirPerfilScreen from './src/screens/AnadirPerfilScreen';
import AsignacionScreen from './src/screens/AsignacionScreen';
import AjustesScreen from './src/screens/AjustesScreen';

type Screen = 'loading' | 'perfil' | 'anadirPerfil' | 'asignacion' | 'ajustes';

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

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileColor, setProfileColor] = useState<string>(getRandomColor());

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('asignacion');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddProfile = useCallback(() => {
    setCurrentScreen('anadirPerfil');
  }, []);

  const handleEnterProfile = useCallback(() => {
    setCurrentScreen('asignacion');
  }, []);

  const handleSettings = useCallback(() => {
    setCurrentScreen('ajustes');
  }, []);

  const handleNextFromAddProfile = useCallback((name: string, color: string) => {
    setProfileName(name);
    setProfileColor(color);
    setCurrentScreen('perfil');
  }, []);

  const handleNextFromAsignacion = useCallback(() => {
    setCurrentScreen('perfil');
  }, []);

  const handleBackFromAjustes = useCallback(() => {
    setCurrentScreen('perfil');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'perfil' && (
        <PerfilScreen
          profileName={profileName}
          profileColor={profileColor}
          onEnter={handleEnterProfile}
          onAddProfile={handleAddProfile}
          onSettings={handleSettings}
        />
      )}
      {currentScreen === 'anadirPerfil' && (
        <AnadirPerfilScreen onNext={handleNextFromAddProfile} />
      )}
      {currentScreen === 'asignacion' && (
        <AsignacionScreen onNext={handleNextFromAsignacion} />
      )}
      {currentScreen === 'ajustes' && (
        <AjustesScreen onBack={handleBackFromAjustes} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
