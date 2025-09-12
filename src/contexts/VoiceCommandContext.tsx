import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceCommandContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  speakText: (text: string) => void;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const useVoiceCommand = () => {
  const context = useContext(VoiceCommandContext);
  if (context === undefined) {
    throw new Error('useVoiceCommand must be used within a VoiceCommandProvider');
  }
  return context;
};

export const VoiceCommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        
        recognitionInstance.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
          setIsListening(false);
          
          // Process voice commands
          processVoiceCommand(result);
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('go to home') || lowerCommand.includes('nyumbani')) {
      window.location.href = '/';
    } else if (lowerCommand.includes('go to health') || lowerCommand.includes('afya')) {
      window.location.href = '/community/health';
    } else if (lowerCommand.includes('go to transport') || lowerCommand.includes('usafiri')) {
      window.location.href = '/community/transport';
    } else if (lowerCommand.includes('go to rewards') || lowerCommand.includes('zawadi')) {
      window.location.href = '/community/rewards';
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('dharura')) {
      // Trigger emergency action
      const emergencyButton = document.querySelector('[data-emergency-button]');
      if (emergencyButton) {
        (emergencyButton as HTMLElement).click();
      }
    }
    
    // Add more command processing as needed
  };

  const startListening = () => {
    if (!isSupported || !recognition) {
      // Fallback for demo
      setIsListening(true);
      setTimeout(() => {
        setTranscript('Nataka transport ya emergency');
        setIsListening(false);
        processVoiceCommand('Nataka transport ya emergency');
      }, 2000);
      return;
    }
    
    setIsListening(true);
    setTranscript('');
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      // Fallback for demo
      setTimeout(() => {
        setTranscript('Nataka transport ya emergency');
        setIsListening(false);
        processVoiceCommand('Nataka transport ya emergency');
      }, 2000);
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    setIsListening(false);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a voice that matches the user's language
      const userLanguage = navigator.language.split('-')[0]; // e.g., 'en' from 'en-US'
      const voice = voices.find(v => v.lang.startsWith(userLanguage)) || voices[0];
      
      if (voice) {
        utterance.voice = voice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VoiceCommandContext.Provider value={{
      isListening,
      transcript,
      startListening,
      stopListening,
      isSupported,
      speakText
    }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};