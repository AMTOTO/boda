import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Mic, MicOff, ChevronDown, ChevronUp, Loader, Brain, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { openaiService } from '../../services/openaiService';
import { useVoiceCommand } from '../../contexts/VoiceCommandContext';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const { isListening: isVoiceListening, startListening: startVoiceListening, stopListening: stopVoiceListening, transcript, isSupported } = useVoiceCommand();

  // Get current dashboard context
  const getCurrentDashboardContext = () => {
    const path = location.pathname;
    const dashboardMap = {
      '/admin': 'Admin Dashboard',
      '/health-worker': 'Health Worker Dashboard',
      '/chv': 'CHV Dashboard',
      '/rider': 'ParaBoda Dashboard',
      '/community': 'Caregivers Dashboard'
    };

    for (const [route, dashboard] of Object.entries(dashboardMap)) {
      if (path.startsWith(route)) {
        return dashboard;
      }
    }
    return 'ParaBoda System';
  };

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentDashboard = getCurrentDashboardContext();
      const welcomeMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: language === 'sw' 
          ? `Hujambo ${user?.name || ''}! Mimi ni ParaBoda-AI, msaidizi wako wa akili bandia. Sasa niko kwenye ${currentDashboard}. Ninaweza kukusaidia na maswali kuhusu afya, usafiri, na huduma zingine za ParaBoda. Vipi ninaweza kukusaidia leo?`
          : `Hello ${user?.name || ''}! I'm ParaBoda-AI, your intelligent assistant. I'm currently in the ${currentDashboard}. I can help you with questions about health, transport, and other ParaBoda services. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, language, user?.name, location.pathname]);

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

  const buildSystemContext = () => {
    const currentDashboard = getCurrentDashboardContext();
    const userRole = user?.role || 'community';
    const userName = user?.name || 'User';
    
    return `You are ParaBoda-AI, an intelligent assistant for the ParaBoda health ecosystem in Kenya. 

CURRENT CONTEXT:
- User: ${userName} (Role: ${userRole})
- Current Dashboard: ${currentDashboard}
- Language: ${language === 'sw' ? 'Kiswahili' : 'English'}

PARABODA SYSTEM OVERVIEW:
ParaBoda is a comprehensive digital health ecosystem that connects:
1. Caregivers (Community members) - Access health services, transport, rewards
2. ParaBodas (Motorcycle riders) - Provide emergency transport, earn points
3. CHVs (Community Health Volunteers) - Manage households, approve transport
4. Health Workers - Manage patients, vaccines, medical records
5. Admins - System oversight, analytics, user management

KEY FEATURES:
- Emergency transport coordination
- Health record management
- Vaccination tracking
- Community health monitoring
- Royalty rewards points system
- M-Supu community fund
- Myth-busting and health education
- Multi-language support (English/Kiswahili)

CURRENT DASHBOARD CAPABILITIES:
${getDashboardCapabilities(currentDashboard)}

RESPONSE GUIDELINES:
- Be helpful, accurate, and culturally appropriate for Kenya
- Provide specific guidance based on current dashboard context
- Suggest relevant features and actions available in the current view
- Always prioritize health and safety
- Recommend professional medical care when appropriate
- Use ${language === 'sw' ? 'Kiswahili' : 'English'} language`;
  };

  const getDashboardCapabilities = (dashboard: string) => {
    switch (dashboard) {
      case 'Admin Dashboard':
        return `- User management and system oversight
- Analytics and performance monitoring
- System settings and configuration
- Troubleshooting tools for all user types
- Security and backup management
- Push notifications and updates`;
      
      case 'Health Worker Dashboard':
        return `- Patient management and medical records
- Vaccination inventory and scheduling
- QR code scanning for patient identification
- Transport coordination for patients
- Health data reporting and analytics`;
      
      case 'CHV Dashboard':
        return `- Household management and monitoring
- Transport request approval and coordination
- Health alerts and emergency reporting
- Community health metrics tracking
- Myth reporting and verification`;
      
      case 'ParaBoda Dashboard':
        return `- Real-time transport requests and mapping
- Emergency response coordination
- Earnings and points tracking
- Route optimization and navigation
- Safety protocols and reporting`;
      
      case 'Caregivers Dashboard':
        return `- Health service access and appointment booking
- Transport request submission
- Royalty rewards points management
- M-Supu community fund participation
- Health education and myth reporting`;
      
      default:
        return `- Comprehensive health and transport services
- Community-driven health ecosystem
- Rewards and incentive programs
- Multi-stakeholder coordination`;
    }
  };

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
      // Build comprehensive context for AI
      const systemContext = buildSystemContext();
      const conversationContext = messages
        .slice(-3)
        .map(msg => `${msg.sender === 'user' ? 'User' : 'ParaBoda-AI'}: ${msg.text}`)
        .join('\n');

      const fullContext = `${systemContext}\n\nRECENT CONVERSATION:\n${conversationContext}`;

      // Get response from OpenAI with full system context
      const response = await openaiService.chatWithAI(inputText, language, fullContext);

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

  // Quick suggestions based on current dashboard and user role
  const getQuickSuggestions = () => {
    const currentDashboard = getCurrentDashboardContext();
    
    const suggestions = {
      'Admin Dashboard': [
        language === 'sw' ? 'Onyesha takwimu za mfumo' : 'Show system analytics',
        language === 'sw' ? 'Vipi naweza kuongeza mtumiaji mpya?' : 'How can I add a new user?',
        language === 'sw' ? 'Ni nini hali ya mfumo?' : 'What is the system status?'
      ],
      'Health Worker Dashboard': [
        language === 'sw' ? 'Vipi naweza kuongeza mgonjwa mpya?' : 'How can I add a new patient?',
        language === 'sw' ? 'Onyesha hifadhi ya chanjo' : 'Show vaccine inventory',
        language === 'sw' ? 'Vipi naweza kutumia skana ya QR?' : 'How do I use the QR scanner?'
      ],
      'CHV Dashboard': [
        language === 'sw' ? 'Vipi naweza kuongeza kaya mpya?' : 'How can I add a new household?',
        language === 'sw' ? 'Onyesha maombi ya usafiri' : 'Show transport requests',
        language === 'sw' ? 'Vipi naweza kuripoti tahadhari?' : 'How can I report an alert?'
      ],
      'ParaBoda Dashboard': [
        language === 'sw' ? 'Onyesha maombi ya usafiri' : 'Show transport requests',
        language === 'sw' ? 'Vipi naweza kuripoti dharura?' : 'How can I report an emergency?',
        language === 'sw' ? 'Ni kiasi gani cha pointi zangu?' : 'How many points do I have?'
      ],
      'Caregivers Dashboard': [
        language === 'sw' ? 'Ninahitaji usafiri wa dharura' : 'I need emergency transport',
        language === 'sw' ? 'Vipi naweza kuchangia M-Supu?' : 'How can I contribute to M-Supu?',
        language === 'sw' ? 'Lini mtoto wangu anahitaji chanjo?' : 'When does my child need vaccines?'
      ]
    };
    
    return suggestions[currentDashboard as keyof typeof suggestions] || suggestions['Caregivers Dashboard'];
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    setShowSuggestions(false);
  };

  const [showSuggestions, setShowSuggestions] = useState(true);

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
          <Brain className="w-6 h-6" />
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
                <div>
                  <h3 className="text-white font-bold">
                    {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {getCurrentDashboardContext()}
                  </p>
                </div>
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
                              ParaBoda-AI
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
                          {language === 'sw' ? 'ParaBoda-AI inafikiri...' : 'ParaBoda-AI is thinking...'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Suggestions */}
            {!isMinimized && showSuggestions && messages.length === 1 && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-700 mb-2 font-medium">
                  {language === 'sw' ? 'Maswali Yanayopendekezwa:' : 'Suggested Questions:'}
                </p>
                <div className="space-y-2">
                  {getQuickSuggestions().map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium text-gray-700 flex items-center space-x-2"
                    >
                      <span>{question}</span>
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
                    placeholder={language === 'sw' ? 'Andika swali lako...' : 'Type your question...'}
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