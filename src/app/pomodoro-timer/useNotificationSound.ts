"use client";

import { useRef, useState } from 'react';

export const useNotificationSound = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    // Recupera a preferência do localStorage, se disponível
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('pomodoroSoundMuted');
      return savedPreference === 'true';
    }
    return false;
  });

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Salva a preferência no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('pomodoroSoundMuted', newMutedState.toString());
    }
    
    // Se estiver desmutando enquanto há um som tocando, para o som
    if (newMutedState && intervalRef.current) {
      stopRepeatingSound();
    }
    
    return newMutedState;
  };

  const playNotificationSound = () => {
    if (isMuted) return; // Não toca o som se estiver mudo
    
    try {
      // Verifica se o contexto de áudio está disponível no navegador
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new window.AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 1000; // Frequência em Hz
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const startRepeatingSound = () => {
    if (isMuted) return; // Não inicia o som se estiver mudo
    
    // Primeiro, garantimos que qualquer intervalo anterior seja limpo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Toca o som imediatamente
    playNotificationSound();
    
    // Configura o intervalo para repetir o som a cada 2 segundos
    intervalRef.current = setInterval(playNotificationSound, 2000);
    
    // Para debug
    console.log('Started repeating sound, interval ID:', intervalRef.current);
  };

  const stopRepeatingSound = () => {
    console.log('Stopping sound, current interval ID:', intervalRef.current);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Sound stopped');
    }
  };

  return { 
    playNotificationSound, 
    startRepeatingSound, 
    stopRepeatingSound,
    isMuted,
    toggleMute
  };
};
