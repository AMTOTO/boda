import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceCommandContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
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

  const startListening = () => {
    if (!isSupported || !recognition) {
      // Fallback for demo
      setIsListening(true);
      setTimeout(() => {
        setTranscript('Nataka transport ya emergency');
        setIsListening(false);
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

  return (
    <VoiceCommandContext.Provider value={{
      isListening,
      transcript,
      startListening,
      stopListening,
      isSupported
    }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};