import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Mic, MicOff, ChevronDown, ChevronUp, Loader, Brain, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { openaiService } from '../../services/openaiService';
import { useVoiceCommand } from '../../contexts/VoiceCommandContext';

interface ChatbotProps {
  userRole?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({ userRole = 'community' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const { isListening: isVoiceListening, startListening: startVoiceListening, stopListening: stopVoiceListening, transcript, isSupported } = useVoiceCommand();

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: language === 'sw' 
          ? `Hujambo ${user?.name || ''}! Mimi ni msaidizi wako wa ParaBoda. Ninaweza kukusaidia na maswali kuhusu afya, usafiri, na huduma zingine. Vipi ninaweza kukusaidia leo?`
          : `Hello ${user?.name || ''}! I'm your ParaBoda assistant. I can help you with questions about health, transport, and other services. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, language, user?.name]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen for voice transcript changes
  useEffect(() => {
    if (transcript && transcript.length > 0) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get context from previous messages
      const context = messages
        .slice(-3)
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      // Get response from mock AI
      const response = await openaiService.chatWithAI(inputText, language, context);

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'sw'
          ? 'Samahani, nimepata hitilafu. Tafadhali jaribu tena baadaye.'
          : 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isVoiceListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  // Quick suggestions based on user role
  const getQuickSuggestions = () => {
    const suggestions = {
      community: [
        language === 'sw' ? 'Ninahitaji usafiri wa dharura' : 'I need emergency transport',
        language === 'sw' ? 'Vipi naweza kuchangia M-Supu?' : 'How can I contribute to M-Supu?',
        language === 'sw' ? 'Lini mtoto wangu anahitaji chanjo?' : 'When does my child need vaccines?'
      ],
      rider: [
        language === 'sw' ? 'Ninahitaji kuripoti dharura' : 'I need to report an emergency',
        language === 'sw' ? 'Vipi naweza kupata pointi zaidi?' : 'How can I earn more points?',
        language === 'sw' ? 'Ninahitaji msaada na ramani' : 'I need help with the map'
      ],
      chv: [
        language === 'sw' ? 'Vipi naweza kuongeza kaya mpya?' : 'How can I add a new household?',
        language === 'sw' ? 'Ninahitaji kuidhinisha usafiri' : 'I need to approve transport',
        language === 'sw' ? 'Vipi naweza kuripoti tahadhari?' : 'How can I report an alert?'
      ],
      health_worker: [
        language === 'sw' ? 'Vipi naweza kuongeza mgonjwa mpya?' : 'How can I add a new patient?',
        language === 'sw' ? 'Ninahitaji kuangalia hifadhi ya chanjo' : 'I need to check vaccine inventory',
        language === 'sw' ? 'Vipi naweza kutumia skana ya QR?' : 'How can I use the QR scanner?'
      ],
      admin: [
        language === 'sw' ? 'Vipi naweza kuongeza mtumiaji mpya?' : 'How can I add a new user?',
        language === 'sw' ? 'Ninahitaji kuona takwimu za mfumo' : 'I need to see system analytics',
        language === 'sw' ? 'Vipi naweza kubadilisha mipangilio?' : 'How can I change settings?'
      ]
    };
    
    return suggestions[userRole as keyof typeof suggestions] || suggestions.community;
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center justify-center z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border-4 border-blue-100`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold">
                  {language === 'sw' ? 'Msaidizi wa ParaBoda' : 'ParaBoda Assistant'}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        {message.sender === 'bot' && (
                          <div className="flex items-center space-x-1 mb-1">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">
                              {language === 'sw' ? 'Msaidizi' : 'Assistant'}
                            </span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center space-x-2">
                        <Loader className="w-4 h-4 text-purple-600 animate-spin" />
                        <span className="text-sm text-gray-600">
                          {language === 'sw' ? 'Inaandika...' : 'Typing...'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Suggestions */}
            {!isMinimized && messages.length === 1 && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-700 mb-2 font-medium">
                  {language === 'sw' ? 'Maswali ya Haraka:' : 'Quick Questions:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getQuickSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion)}
                      className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full ${
                      isVoiceListening 
                        ? 'bg-red-100 text-red-600 animate-pulse' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isVoiceListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={language === 'sw' ? 'Andika ujumbe wako...' : 'Type your message...'}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className={`p-2 rounded-full ${
                      !inputText.trim() || isLoading
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};