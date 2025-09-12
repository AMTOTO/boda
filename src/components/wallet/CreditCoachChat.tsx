import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Phone, 
  Smartphone,
  Bot,
  User,
  Loader,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  HelpCircle,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CreditCoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  userCreditScore?: number;
  userSavings?: number;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionType?: 'tip' | 'warning' | 'success' | 'info';
}

export const CreditCoachChat: React.FC<CreditCoachChatProps> = ({
  isOpen,
  onClose,
  userCreditScore = 650,
  userSavings = 5000,
  className = ''
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick action suggestions based on user's financial profile
  const getQuickSuggestions = () => {
    const suggestions = [];
    
    if (userCreditScore < 650) {
      suggestions.push(
        language === 'sw' ? 'Jinsi ya kuboresha alama za mkopo' : 'How to improve my credit score',
        language === 'sw' ? 'Ni kwa nini alama zangu ni chini?' : 'Why is my credit score low?'
      );
    }
    
    if (userSavings < 10000) {
      suggestions.push(
        language === 'sw' ? 'Njia za kuongeza akiba' : 'Ways to increase savings',
        language === 'sw' ? 'Mpango wa kuokoa pesa' : 'Savings plan recommendations'
      );
    }
    
    suggestions.push(
      language === 'sw' ? 'Ni mkopo gani ninastahili?' : 'What loans am I eligible for?',
      language === 'sw' ? 'Jinsi ya kupanga bajeti' : 'How to create a budget',
      language === 'sw' ? 'Faida za kuokoa pesa' : 'Benefits of saving money'
    );
    
    return suggestions.slice(0, 4);
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'coach',
        content: language === 'sw' 
          ? `Hujambo! Mimi ni Mkocha wako wa Mkopo wa MSUPU. Nina alama zako za mkopo (${userCreditScore}) na akiba zako (${formatAmount(userSavings)}). Ninaweza kukusaidia kuboresha hali yako ya kifedha. Ni nini ninaweza kukusaidia leo?`
          : `Hello! I'm your MSUPU Credit Coach. I can see your credit score (${userCreditScore}) and savings (${formatAmount(userSavings)}). I can help you improve your financial health. How can I assist you today?`,
        timestamp: new Date(),
        actionType: 'info'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language, userCreditScore, userSavings, formatAmount]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const response = generateCoachResponse(inputText);
      const coachMessage: ChatMessage = {
        id: `coach_${Date.now()}`,
        type: 'coach',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionType: response.actionType
      };

      setMessages(prev => [...prev, coachMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateCoachResponse = (userInput: string): {
    content: string;
    suggestions?: string[];
    actionType: 'tip' | 'warning' | 'success' | 'info';
  } => {
    const input = userInput.toLowerCase();
    
    // Credit score improvement
    if (input.includes('credit score') || input.includes('alama') || input.includes('improve')) {
      return {
        content: language === 'sw' 
          ? `Kuboresha alama za mkopo: 1) Ongeza akiba zako kwa kuokoa angalau 20% ya mapato yako. 2) Lipa mikopo kwa wakati. 3) Tumia huduma za MSUPU mara kwa mara. 4) Shiriki katika shughuli za jamii. Alama zako za sasa (${userCreditScore}) zinaweza kuboreshwa kwa miezi 3-6.`
          : `To improve your credit score: 1) Increase your savings by saving at least 20% of your income. 2) Make loan payments on time. 3) Use MSUPU services regularly. 4) Participate in community activities. Your current score (${userCreditScore}) can improve in 3-6 months.`,
        suggestions: [
          language === 'sw' ? 'Anza mpango wa kuokoa' : 'Start a savings plan',
          language === 'sw' ? 'Ona mikopo inayopatikana' : 'View available loans'
        ],
        actionType: 'tip'
      };
    }
    
    // Savings advice
    if (input.includes('savings') || input.includes('akiba') || input.includes('save')) {
      return {
        content: language === 'sw' 
          ? `Njia za kuongeza akiba: 1) Weka mpango wa kuokoa kila wiki. 2) Tumia kanuni ya 50/30/20 (mahitaji/matakwa/akiba). 3) Okoa pesa ndogo kila siku. 4) Shiriki katika vikundi vya akiba. Akiba zako za sasa ni ${formatAmount(userSavings)} - lengo ni kufikia ${formatAmount(userSavings * 2)} katika miezi 6.`
          : `Ways to increase savings: 1) Set up a weekly savings plan. 2) Use the 50/30/20 rule (needs/wants/savings). 3) Save small amounts daily. 4) Join savings groups. Your current savings is ${formatAmount(userSavings)} - aim for ${formatAmount(userSavings * 2)} in 6 months.`,
        suggestions: [
          language === 'sw' ? 'Tengeneza mpango wa akiba' : 'Create savings plan',
          language === 'sw' ? 'Jiunge na kikundi cha akiba' : 'Join savings group'
        ],
        actionType: 'success'
      };
    }
    
    // Loan eligibility
    if (input.includes('loan') || input.includes('mkopo') || input.includes('eligible')) {
      const eligibleAmount = Math.floor(userSavings * 2);
      return {
        content: language === 'sw' 
          ? `Kulingana na alama zako za mkopo (${userCreditScore}) na akiba (${formatAmount(userSavings)}), unastahili mkopo wa hadi ${formatAmount(eligibleAmount)}. Mikopo inayopatikana: 1) Mkopo wa Biashara - riba 12% kwa mwaka. 2) Mkopo wa Dharura - riba 8% kwa mwaka. 3) Mkopo wa Elimu - riba 6% kwa mwaka.`
          : `Based on your credit score (${userCreditScore}) and savings (${formatAmount(userSavings)}), you're eligible for loans up to ${formatAmount(eligibleAmount)}. Available loans: 1) Business Loan - 12% annual interest. 2) Emergency Loan - 8% annual interest. 3) Education Loan - 6% annual interest.`,
        suggestions: [
          language === 'sw' ? 'Omba mkopo wa biashara' : 'Apply for business loan',
          language === 'sw' ? 'Hesabu malipo ya mkopo' : 'Calculate loan payments'
        ],
        actionType: 'info'
      };
    }
    
    // Budget planning
    if (input.includes('budget') || input.includes('bajeti') || input.includes('plan')) {
      return {
        content: language === 'sw' 
          ? `Mpango wa bajeti: 1) Andika mapato yako yote. 2) Orodhesha gharama za lazima (chakula, nyumba, usafiri). 3) Weka akiba 20% ya mapato. 4) Tumia 30% kwa matakwa. 5) Fuatilia matumizi yako kila wiki. Nitakusaidia kutengeneza bajeti ya kibinafsi.`
          : `Budget planning: 1) List all your income sources. 2) Track essential expenses (food, housing, transport). 3) Save 20% of income. 4) Use 30% for wants. 5) Review your spending weekly. I can help you create a personalized budget.`,
        suggestions: [
          language === 'sw' ? 'Tengeneza bajeti ya kibinafsi' : 'Create personal budget',
          language === 'sw' ? 'Fuatilia matumizi' : 'Track expenses'
        ],
        actionType: 'tip'
      };
    }
    
    // Default response
    return {
      content: language === 'sw' 
        ? `Ninaweza kukusaidia na: 1) Kuboresha alama za mkopo. 2) Mpango wa kuokoa pesa. 3) Ushauri wa mikopo. 4) Mpango wa bajeti. 5) Elimu ya kifedha. Ni swali gani una kuhusu fedha zako?`
        : `I can help you with: 1) Improving credit scores. 2) Savings strategies. 3) Loan guidance. 4) Budget planning. 5) Financial education. What specific question do you have about your finances?`,
      suggestions: getQuickSuggestions(),
      actionType: 'info'
    };
  };

  const handleSuggestedQuestion = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Mock voice input - in real implementation, use Web Speech API
    setTimeout(() => {
      setInputText(language === 'sw' ? 'Ninahitaji msaada wa kuokoa pesa' : 'I need help with saving money');
      setIsListening(false);
    }, 2000);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'tip': return 'text-wallet-accent-600';
      case 'warning': return 'text-wallet-warning-600';
      case 'success': return 'text-wallet-success-600';
      default: return 'text-wallet-primary-600';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            height: isMinimized ? 'auto' : '600px'
          }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-wallet-xl overflow-hidden flex flex-col border-2 border-wallet-primary-200 dark:border-wallet-primary-800 ${className}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-wallet-primary-500 to-wallet-accent-500 p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 pattern-kente opacity-10"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {language === 'sw' ? 'Mkocha wa Mkopo' : 'Credit Coach'}
                </h3>
                <p className="text-white/80 text-sm">
                  {language === 'sw' ? 'Msaidizi wa Kifedha' : 'Financial Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 relative z-10">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-wallet-secondary-50 to-white dark:from-wallet-secondary-900/20 dark:to-gray-800 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-wallet-primary-500 to-wallet-primary-600 text-white rounded-3xl rounded-tr-lg'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-3xl rounded-tl-lg shadow-wallet border border-wallet-secondary-200 dark:border-wallet-secondary-700'
                    } p-4`}>
                      
                      {/* Coach message header */}
                      {message.type === 'coach' && (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              message.actionType === 'tip' ? 'bg-wallet-accent-100 text-wallet-accent-600' :
                              message.actionType === 'warning' ? 'bg-wallet-warning-100 text-wallet-warning-600' :
                              message.actionType === 'success' ? 'bg-wallet-success-100 text-wallet-success-600' :
                              'bg-wallet-primary-100 text-wallet-primary-600'
                            }`}>
                              {getActionIcon(message.actionType || 'info')}
                            </div>
                            <span className="text-sm font-semibold text-wallet-primary-600 dark:text-wallet-primary-400">
                              MSUPU Coach
                            </span>
                          </div>
                          <button
                            onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                            className="p-1 text-wallet-secondary-400 hover:text-wallet-secondary-600 dark:text-wallet-secondary-500 dark:hover:text-wallet-secondary-300 transition-colors"
                            aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-wallet-secondary-500 dark:text-wallet-secondary-400">
                            {language === 'sw' ? 'Mapendekezo:' : 'Suggestions:'}
                          </p>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestedQuestion(suggestion)}
                              className="block w-full text-left p-2 bg-wallet-primary-50 dark:bg-wallet-primary-900/30 text-wallet-primary-700 dark:text-wallet-primary-300 rounded-xl hover:bg-wallet-primary-100 dark:hover:bg-wallet-primary-900/50 transition-colors text-sm font-medium"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className="text-xs opacity-70 mt-2 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-3xl rounded-tl-lg shadow-wallet border border-wallet-secondary-200 dark:border-wallet-secondary-700 p-4 flex items-center space-x-3">
                    <Loader className="w-5 h-5 text-wallet-primary-600 animate-spin" />
                    <span className="text-wallet-secondary-600 dark:text-wallet-secondary-400 text-sm">
                      {language === 'sw' ? 'Mkocha anafikiri...' : 'Coach is thinking...'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Quick suggestions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-wallet-accent-50 dark:bg-wallet-accent-900/20 border border-wallet-accent-200 dark:border-wallet-accent-800 rounded-2xl p-4"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-wallet-accent-600 dark:text-wallet-accent-400" />
                    <h4 className="font-semibold text-wallet-accent-800 dark:text-wallet-accent-200">
                      {language === 'sw' ? 'Maswali Yanayopendekezwa' : 'Suggested Questions'}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {getQuickSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(suggestion)}
                        className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-xl hover:bg-wallet-accent-100 dark:hover:bg-wallet-accent-900/30 transition-colors text-sm font-medium text-wallet-accent-700 dark:text-wallet-accent-300 border border-wallet-accent-200 dark:border-wallet-accent-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <div className="p-4 border-t border-wallet-secondary-200 dark:border-wallet-secondary-700 bg-white dark:bg-gray-800">
              {/* Quick Actions */}
              <div className="flex justify-center space-x-3 mb-4">
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`flex items-center space-x-2 min-h-[48px] px-4 py-2 rounded-2xl font-medium transition-all ${
                    isListening 
                      ? 'bg-wallet-error-100 text-wallet-error-600 animate-pulse' 
                      : 'bg-wallet-primary-100 text-wallet-primary-600 hover:bg-wallet-primary-200 dark:bg-wallet-primary-900/30 dark:text-wallet-primary-400 dark:hover:bg-wallet-primary-900/50'
                  }`}
                  aria-label={language === 'sw' ? 'Tumia sauti' : 'Use voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-sm">
                    {isListening 
                      ? (language === 'sw' ? 'Inasikiliza...' : 'Listening...') 
                      : (language === 'sw' ? 'Sauti' : 'Voice')
                    }
                  </span>
                </button>
                
                <button
                  className="flex items-center space-x-2 min-h-[48px] px-4 py-2 bg-wallet-accent-100 text-wallet-accent-600 rounded-2xl hover:bg-wallet-accent-200 dark:bg-wallet-accent-900/30 dark:text-wallet-accent-400 dark:hover:bg-wallet-accent-900/50 transition-all font-medium"
                  aria-label={language === 'sw' ? 'Piga simu' : 'Call support'}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{language === 'sw' ? 'Piga' : 'Call'}</span>
                </button>
                
                <button
                  className="flex items-center space-x-2 min-h-[48px] px-4 py-2 bg-wallet-secondary-100 text-wallet-secondary-600 rounded-2xl hover:bg-wallet-secondary-200 dark:bg-wallet-secondary-900/30 dark:text-wallet-secondary-400 dark:hover:bg-wallet-secondary-900/50 transition-all font-medium"
                  aria-label={language === 'sw' ? 'USSD' : 'USSD menu'}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm">USSD</span>
                </button>
              </div>

              {/* Text Input */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full px-4 py-3 pr-12 border-2 border-wallet-secondary-300 dark:border-wallet-secondary-600 rounded-2xl focus:ring-4 focus:ring-wallet-primary-500/20 focus:border-wallet-primary-500 dark:bg-gray-700 dark:text-white text-base"
                    placeholder={language === 'sw' ? 'Andika swali lako la kifedha...' : 'Type your financial question...'}
                    disabled={isLoading}
                  />
                  <button
                    onClick={startVoiceInput}
                    disabled={isListening || isLoading}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                      isListening ? 'text-wallet-error-600 bg-wallet-error-100' : 'text-wallet-secondary-400 hover:text-wallet-secondary-600'
                    }`}
                    aria-label={language === 'sw' ? 'Tumia sauti' : 'Use voice input'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="min-h-[48px] min-w-[48px] bg-gradient-to-r from-wallet-primary-500 to-wallet-primary-600 text-white rounded-2xl hover:from-wallet-primary-600 hover:to-wallet-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-wallet active:scale-95"
                  aria-label={language === 'sw' ? 'Tuma ujumbe' : 'Send message'}
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Voice listening indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-3 bg-wallet-error-50 dark:bg-wallet-error-900/20 border border-wallet-error-200 dark:border-wallet-error-800 rounded-xl text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-wallet-error-600 dark:text-wallet-error-400">
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span className="font-medium">
                      {language === 'sw' ? 'Inasikiliza... Zungumza sasa' : 'Listening... Speak now'}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-wallet-primary-100 dark:bg-wallet-primary-900/30 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-wallet-primary-600 dark:text-wallet-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-wallet-secondary-600 dark:text-wallet-secondary-400">
                    {language === 'sw' ? 'Mkocha yupo tayari kusaidia' : 'Coach ready to help'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {messages.filter(m => m.type === 'user').length > 0 && (
                    <div className="w-2 h-2 bg-wallet-success-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};