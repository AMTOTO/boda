import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './Modal';
import { CameraCapture } from './CameraCapture';
import { useLanguage } from '../../contexts/LanguageContext';
import { openaiService, BSenseAnalysis } from '../../services/openaiService';
import { translationService } from '../../services/translationService';
import { 
  Brain, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Loader, 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Thermometer,
  Activity,
  Stethoscope,
  Eye,
  Ear,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  FileText,
  Camera,
  Upload,
  Download,
  Share2,
  Star,
  Award,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Video,
  Headphones
} from 'lucide-react';

interface BSenseAIProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis?: BSenseAnalysis;
  mediaType?: 'text' | 'audio' | 'image' | 'video';
  mediaUrl?: string;
}

export const BSenseAI: React.FC<BSenseAIProps> = ({ isOpen, onClose, userRole = 'community' }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'symptoms' | 'education' | 'myths'>('chat');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    location: '',
    duration: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common symptoms with icons
  const commonSymptoms = [
    { id: 'fever', name: language === 'sw' ? 'Homa' : 'Fever', icon: Thermometer, color: 'red' },
    { id: 'headache', name: language === 'sw' ? 'Maumivu ya kichwa' : 'Headache', icon: Brain, color: 'purple' },
    { id: 'cough', name: language === 'sw' ? 'Kikohozi' : 'Cough', icon: Activity, color: 'blue' },
    { id: 'fatigue', name: language === 'sw' ? 'Uchovu' : 'Fatigue', icon: Clock, color: 'orange' },
    { id: 'nausea', name: language === 'sw' ? 'Kichefuchefu' : 'Nausea', icon: AlertTriangle, color: 'yellow' },
    { id: 'diarrhea', name: language === 'sw' ? 'Kuhara' : 'Diarrhea', icon: Activity, color: 'brown' },
    { id: 'vomiting', name: language === 'sw' ? 'Kutapika' : 'Vomiting', icon: AlertTriangle, color: 'red' },
    { id: 'chest_pain', name: language === 'sw' ? 'Maumivu ya kifua' : 'Chest Pain', icon: Heart, color: 'red' },
    { id: 'difficulty_breathing', name: language === 'sw' ? 'Ugumu wa kupumua' : 'Difficulty Breathing', icon: Activity, color: 'blue' },
    { id: 'joint_pain', name: language === 'sw' ? 'Maumivu ya viungo' : 'Joint Pain', icon: Activity, color: 'orange' },
    { id: 'skin_rash', name: language === 'sw' ? 'Upele' : 'Skin Rash', icon: Eye, color: 'pink' },
    { id: 'loss_appetite', name: language === 'sw' ? 'Kupoteza hamu ya chakula' : 'Loss of Appetite', icon: AlertTriangle, color: 'gray' }
  ];

  // Health education topics
  const educationTopics = [
    { id: 'malaria', name: language === 'sw' ? 'Malaria' : 'Malaria', icon: Shield, emoji: '🦟' },
    { id: 'vaccination', name: language === 'sw' ? 'Chanjo' : 'Vaccination', icon: Stethoscope, emoji: '💉' },
    { id: 'nutrition', name: language === 'sw' ? 'Lishe' : 'Nutrition', icon: Heart, emoji: '🥗' },
    { id: 'hygiene', name: language === 'sw' ? 'Usafi' : 'Hygiene', icon: Shield, emoji: '🧼' },
    { id: 'maternal_health', name: language === 'sw' ? 'Afya ya mama' : 'Maternal Health', icon: Heart, emoji: '🤱' },
    { id: 'child_health', name: language === 'sw' ? 'Afya ya mtoto' : 'Child Health', icon: Heart, emoji: '👶' }
  ];

  // Common health myths
  const commonMyths = [
    language === 'sw' ? 'Chanjo zinasababisha ulemavu' : 'Vaccines cause autism',
    language === 'sw' ? 'Malaria haisambazwi na mbu' : 'Malaria is not spread by mosquitoes',
    language === 'sw' ? 'Dawa za asili ni bora kuliko za hospitali' : 'Traditional medicine is always better than modern medicine',
    language === 'sw' ? 'COVID-19 ni uwongo' : 'COVID-19 is a hoax',
    language === 'sw' ? 'Kunywa maji ya moto kunatibu ugonjwa wote' : 'Drinking hot water cures all diseases'
  ];

  // Suggested questions based on user role
  const suggestedQuestions = {
    community: [
      language === 'sw' ? 'Nina homa na kikohozi. Inaweza kuwa nini?' : 'I have fever and cough. What could it be?',
      language === 'sw' ? 'Ni chanjo gani mtoto wangu anahitaji?' : 'What vaccines does my child need?',
      language === 'sw' ? 'Dalili za malaria ni zipi?' : 'What are the symptoms of malaria?',
      language === 'sw' ? 'Jinsi ya kuzuia magonjwa ya kuhara' : 'How to prevent diarrheal diseases'
    ],
    rider: [
      language === 'sw' ? 'Dalili za dharura za afya ni zipi?' : 'What are signs of a health emergency?',
      language === 'sw' ? 'Huduma ya kwanza kwa ajali ya barabarani' : 'First aid for road accidents',
      language === 'sw' ? 'Jinsi ya kusaidia mwanamke mjamzito' : 'How to assist a pregnant woman',
      language === 'sw' ? 'Kuzuia maambukizi wakati wa kusafirisha wagonjwa' : 'Preventing infections when transporting patients'
    ],
    chv: [
      language === 'sw' ? 'Dalili za utapiamlo kwa watoto' : 'Signs of malnutrition in children',
      language === 'sw' ? 'Jinsi ya kufuatilia wajawazito' : 'How to monitor pregnant women',
      language === 'sw' ? 'Ratiba ya chanjo za watoto' : 'Child vaccination schedule',
      language === 'sw' ? 'Kuzuia magonjwa ya kuambukiza katika jamii' : 'Preventing infectious diseases in the community'
    ],
    health_worker: [
      language === 'sw' ? 'Matibabu ya malaria kwa watoto' : 'Malaria treatment for children',
      language === 'sw' ? 'Dalili za ugonjwa wa moyo' : 'Symptoms of heart disease',
      language === 'sw' ? 'Miongozo ya chanjo mpya' : 'New vaccination guidelines',
      language === 'sw' ? 'Ushauri wa lishe kwa wajawazito' : 'Nutritional advice for pregnant women'
    ],
    admin: [
      language === 'sw' ? 'Takwimu za afya za jamii' : 'Community health statistics',
      language === 'sw' ? 'Mwelekeo wa magonjwa ya kuambukiza' : 'Infectious disease trends',
      language === 'sw' ? 'Mafanikio ya programu za afya' : 'Health program success metrics',
      language === 'sw' ? 'Changamoto za afya za jamii' : 'Community health challenges'
    ]
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: language === 'sw' 
          ? 'Hujambo! Mimi ni ParaBoda-AI, msaidizi wako wa afya. Ninaweza kukusaidia kuchanganua dalili, kupata elimu ya afya, na kupambana na uwongo wa kiafya. Ni nini ninaweza kukusaidia leo?'
          : 'Hello! I am ParaBoda-AI, your health assistant. I can help you analyze symptoms, get health education, and debunk health myths. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

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

    try {
      // Translate user input to English for AI processing if needed
      const englishInput = language !== 'en' 
        ? await translationService.translateText(inputText, 'en', language)
        : inputText;

      // Get AI response
      let aiResponse = '';
      let analysis: BSenseAnalysis | undefined;

      if (activeTab === 'symptoms' || englishInput.toLowerCase().includes('symptom') || englishInput.toLowerCase().includes('pain') || englishInput.toLowerCase().includes('fever')) {
        analysis = await openaiService.analyzeHealthSymptoms(englishInput, patientInfo);
        aiResponse = `Based on your symptoms, here's my analysis:\n\nRisk Level: ${analysis.healthRisk.toUpperCase()}\nUrgency: ${analysis.urgency}/10\n\nRecommendations:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}\n\nNext Steps:\n${analysis.nextSteps.map(s => `• ${s}`).join('\n')}`;
      } else if (activeTab === 'education' || englishInput.toLowerCase().includes('learn') || englishInput.toLowerCase().includes('education')) {
        const topic = extractTopicFromInput(englishInput);
        aiResponse = await openaiService.generateHealthEducation(topic, language);
      } else if (activeTab === 'myths' || englishInput.toLowerCase().includes('myth') || englishInput.toLowerCase().includes('false')) {
        aiResponse = await openaiService.debunkMyth(englishInput, language);
      } else {
        // General health query
        aiResponse = await openaiService.chatWithAI(englishInput, language);
      }

      // Translate response back to user's language if needed
      const translatedResponse = language !== 'en' 
        ? await translationService.translateText(aiResponse, language, 'en')
        : aiResponse;

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: translatedResponse,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('ParaBoda-AI error:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: language === 'sw' 
          ? 'Samahani, nimepata hitilafu. Tafadhali jaribu tena au wasiliana na mfanyakazi wa afya.'
          : 'Sorry, I encountered an error. Please try again or contact a healthcare worker.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopicFromInput = (input: string): string => {
    const topics = ['malaria', 'vaccination', 'nutrition', 'hygiene', 'maternal', 'child', 'covid', 'diabetes', 'hypertension'];
    const foundTopic = topics.find(topic => input.toLowerCase().includes(topic));
    return foundTopic || 'general health';
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSelectedSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    const symptomNames = selectedSymptoms.map(id => 
      commonSymptoms.find(s => s.id === id)?.name || id
    ).join(', ');

    setIsLoading(true);
    try {
      const analysis = await openaiService.analyzeHealthSymptoms(symptomNames, patientInfo);
      
      const analysisMessage: ChatMessage = {
        id: `analysis_${Date.now()}`,
        type: 'ai',
        content: language === 'sw' 
          ? `Uchambuzi wa dalili zako:\n\nKiwango cha hatari: ${analysis.healthRisk.toUpperCase()}\nHaraka: ${analysis.urgency}/10\n\nMapendekezo:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}`
          : `Analysis of your symptoms:\n\nRisk Level: ${analysis.healthRisk.toUpperCase()}\nUrgency: ${analysis.urgency}/10\n\nRecommendations:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}`,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, analysisMessage]);
      setActiveTab('chat');
      setSelectedSymptoms([]);
    } catch (error) {
      console.error('Symptom analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEducationTopic = async (topic: string) => {
    setIsLoading(true);
    try {
      const education = await openaiService.generateHealthEducation(topic, language);
      
      const educationMessage: ChatMessage = {
        id: `education_${Date.now()}`,
        type: 'ai',
        content: education,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, educationMessage]);
      setActiveTab('chat');
    } catch (error) {
      console.error('Education error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMythDebunk = async (myth: string) => {
    setIsLoading(true);
    try {
      const debunk = await openaiService.debunkMyth(myth, language);
      
      const debunkMessage: ChatMessage = {
        id: `debunk_${Date.now()}`,
        type: 'ai',
        content: debunk,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, debunkMessage]);
      setActiveTab('chat');
    } catch (error) {
      console.error('Myth debunk error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Mock voice input - in real implementation, use Web Speech API
    setTimeout(() => {
      setInputText(language === 'sw' ? 'Nina homa na maumivu ya kichwa' : 'I have fever and headache');
      setIsListening(false);
    }, 2000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    if (setShowSuggestions) {
      setShowSuggestions(false);
    }
  };

  const startRecording = (type: 'audio' | 'video') => {
    setRecordingType(type);
    setIsRecording(true);
    
    // Mock recording - in real implementation, use MediaRecorder API
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Mock recording result
    const mockMediaUrl = recordingType === 'audio' 
      ? 'https://example.com/recording.mp3' 
      : 'https://example.com/recording.mp4';
    
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: recordingType === 'audio' 
        ? (language === 'sw' ? '[Rekodi ya Sauti]' : '[Audio Recording]')
        : (language === 'sw' ? '[Rekodi ya Video]' : '[Video Recording]'),
      timestamp: new Date(),
      mediaType: recordingType,
      mediaUrl: mockMediaUrl
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Mock AI response to recording
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: recordingType === 'audio'
          ? (language === 'sw' 
              ? 'Nimesikia rekodi yako ya sauti. Kulingana na maelezo yako, inaonekana una dalili za malaria. Ninashauri upate uchunguzi zaidi katika kituo cha afya cha karibu.'
              : 'I heard your audio recording. Based on your description, it sounds like you may have symptoms of malaria. I recommend getting further examination at your nearest health facility.')
          : (language === 'sw'
              ? 'Nimeona video yako. Upele unaoonekana unaweza kuwa eczema. Ninashauri uone daktari wa ngozi kwa matibabu sahihi.'
              : 'I viewed your video. The rash shown appears to be eczema. I recommend seeing a dermatologist for proper treatment.'),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
    
    setRecordingType(null);
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    // Add user message with the captured image
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: language === 'sw' ? '[Picha]' : '[Image]',
      timestamp: new Date(),
      mediaType: 'image',
      mediaUrl: imageData
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Mock AI response to the image
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: language === 'sw' 
          ? 'Nimeona picha yako. Kulingana na picha hiyo, inaonekana kama upele wa kawaida. Ninashauri utumie cream ya hydrocortisone na uone daktari ikiwa haitatuliki ndani ya siku 3.'
          : 'I\'ve viewed your image. Based on the picture, it appears to be a common rash. I recommend using hydrocortisone cream and seeing a doctor if it doesn\'t resolve within 3 days.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
    
    setShowCameraCapture(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const isImage = file.type.startsWith('image/');
    
    // Create a mock URL for the file
    const mockUrl = `https://example.com/${file.name}`;
    
    // Add user message with the file
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: isImage 
        ? (language === 'sw' ? '[Picha]' : '[Image]')
        : (language === 'sw' ? '[Faili]' : '[File]'),
      timestamp: new Date(),
      mediaType: isImage ? 'image' : 'text',
      mediaUrl: mockUrl
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Mock AI response to the file
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: isImage
          ? (language === 'sw' 
              ? 'Nimeona picha yako. Kulingana na picha hiyo, inaonekana kama upele wa kawaida. Ninashauri utumie cream ya hydrocortisone na uone daktari ikiwa haitatuliki ndani ya siku 3.'
              : 'I\'ve viewed your image. Based on the picture, it appears to be a common rash. I recommend using hydrocortisone cream and seeing a doctor if it doesn\'t resolve within 3 days.')
          : (language === 'sw'
              ? 'Nimepokea faili yako. Nitaichambua na kukupa majibu hivi punde.'
              : 'I\'ve received your file. I\'ll analyze it and provide you with feedback shortly.'),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tabs = [
    { id: 'chat', name: language === 'sw' ? 'Mazungumzo' : 'Chat', icon: MessageSquare, emoji: '💬' },
    { id: 'symptoms', name: language === 'sw' ? 'Dalili' : 'Symptoms', icon: Stethoscope, emoji: '🩺' },
    { id: 'education', name: language === 'sw' ? 'Elimu' : 'Education', icon: BookOpen, emoji: '📚' },
    { id: 'myths', name: language === 'sw' ? 'Uwongo' : 'Myths', icon: Shield, emoji: '🛡️' }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`🧠 ParaBoda-AI ${language === 'sw' ? 'Msaidizi wa Afya' : 'Health Assistant'}`}
        size="xl"
      >
        <div className="h-[600px] flex flex-col">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="text-lg">{tab.emoji}</span>
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-xl">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow-md'
                      }`}>
                        {message.type === 'ai' && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-blue-600">ParaBoda-AI</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Display media if present */}
                        {message.mediaType && message.mediaUrl && (
                          <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                            {message.mediaType === 'image' && (
                              <div className="flex items-center space-x-2">
                                <Camera className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">{language === 'sw' ? 'Picha imeambatishwa' : 'Image attached'}</span>
                              </div>
                            )}
                            {message.mediaType === 'audio' && (
                              <div className="flex items-center space-x-2">
                                <Headphones className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">{language === 'sw' ? 'Sauti imeambatishwa' : 'Audio attached'}</span>
                              </div>
                            )}
                            {message.mediaType === 'video' && (
                              <div className="flex items-center space-x-2">
                                <Video className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">{language === 'sw' ? 'Video imeambatishwa' : 'Video attached'}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {message.analysis && (
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold text-purple-600">
                                {language === 'sw' ? 'Uchambuzi wa Kina' : 'Detailed Analysis'}
                              </span>
                            </div>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                              message.analysis.healthRisk === 'critical' ? 'bg-red-100 text-red-800' :
                              message.analysis.healthRisk === 'high' ? 'bg-orange-100 text-orange-800' :
                              message.analysis.healthRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.analysis.healthRisk.toUpperCase()} {language === 'sw' ? 'HATARI' : 'RISK'}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white p-4 rounded-2xl shadow-md">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-gray-600">
                          {language === 'sw' ? 'ParaBoda-AI inafikiri...' : 'ParaBoda-AI is thinking...'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested questions */}
                {showSuggestions && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 p-4 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-800">
                        {language === 'sw' ? 'Maswali Yanayopendekezwa' : 'Suggested Questions'}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {suggestedQuestions[userRole as keyof typeof suggestedQuestions]?.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-gray-700 flex items-center space-x-2"
                        >
                          <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>{question}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 p-4 rounded-xl border border-red-200 text-center"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                      {recordingType === 'audio' ? (
                        <Mic className="w-8 h-8 text-red-600" />
                      ) : (
                        <Video className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-red-800 mb-1">
                      {recordingType === 'audio' 
                        ? (language === 'sw' ? 'Inarekodi Sauti...' : 'Recording Audio...') 
                        : (language === 'sw' ? 'Inarekodi Video...' : 'Recording Video...')}
                    </h3>
                    <p className="text-red-600 text-sm mb-3">
                      {language === 'sw' ? 'Bofya "Acha" kumaliza' : 'Click "Stop" to finish'}
                    </p>
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {language === 'sw' ? 'Acha' : 'Stop'}
                    </button>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex flex-col space-y-2">
                {/* Media input options */}
                <div className="flex justify-center space-x-3 mb-1">
                  <button
                    onClick={() => startRecording('audio')}
                    disabled={isRecording}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title={language === 'sw' ? 'Rekodi Sauti' : 'Record Audio'}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => startRecording('video')}
                    disabled={isRecording}
                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    title={language === 'sw' ? 'Rekodi Video' : 'Record Video'}
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowCameraCapture(true)}
                    disabled={isRecording}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title={language === 'sw' ? 'Pakia Picha' : 'Upload Image'}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isRecording}
                    className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                    title={language === 'sw' ? 'Pakia Faili' : 'Upload File'}
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={language === 'sw' ? 'Andika swali lako la afya...' : 'Type your health question...'}
                      disabled={isLoading || isRecording}
                    />
                    <button
                      onClick={startVoiceInput}
                      disabled={isListening || isLoading || isRecording}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        isListening ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading || isRecording}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Symptoms Tab */}
          {activeTab === 'symptoms' && (
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Patient Info */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Taarifa za Mgonjwa' : 'Patient Information'}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={language === 'sw' ? 'Umri' : 'Age'}
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'sw' ? 'Jinsia' : 'Gender'}</option>
                    <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                    <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={language === 'sw' ? 'Muda wa dalili' : 'Duration of symptoms'}
                    value={patientInfo.duration}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, duration: e.target.value }))}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder={language === 'sw' ? 'Mahali' : 'Location'}
                    value={patientInfo.location}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, location: e.target.value }))}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Symptoms Selection */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-red-500" />
                  <span>{language === 'sw' ? 'Chagua Dalili Zako' : 'Select Your Symptoms'}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        selectedSymptoms.includes(symptom.id)
                          ? `border-${symptom.color}-500 bg-${symptom.color}-50`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <symptom.icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedSymptoms.includes(symptom.id) ? `text-${symptom.color}-600` : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium">{symptom.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeSelectedSymptoms}
                disabled={selectedSymptoms.length === 0 || isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{language === 'sw' ? 'Inachambuza...' : 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Chambuza Dalili' : 'Analyze Symptoms'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="flex-1 space-y-6 overflow-y-auto">
              <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span>{language === 'sw' ? 'Mada za Elimu ya Afya' : 'Health Education Topics'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {educationTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleEducationTopic(topic.id)}
                    disabled={isLoading}
                    className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-center disabled:opacity-50"
                  >
                    <div className="text-4xl mb-2">{topic.emoji}</div>
                    <topic.icon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                  </button>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Tafuta Mada Nyingine' : 'Search Other Topics'}</span>
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={language === 'sw' ? 'Andika mada ya afya...' : 'Type a health topic...'}
                    className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEducationTopic((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (input && input.value) {
                        handleEducationTopic(input.value);
                      }
                    }}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Myths Tab */}
          {activeTab === 'myths' && (
            <div className="flex-1 space-y-6 overflow-y-auto">
              <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span>{language === 'sw' ? 'Uwongo wa Kiafya' : 'Common Health Myths'}</span>
              </h3>
              <div className="space-y-3">
                {commonMyths.map((myth, index) => (
                  <button
                    key={index}
                    onClick={() => handleMythDebunk(myth)}
                    disabled={isLoading}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left disabled:opacity-50"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-800">{myth}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Ripoti Uwongo Mpya' : 'Report New Myth'}</span>
                </h3>
                <div className="space-y-3">
                  <textarea
                    placeholder={language === 'sw' ? 'Andika uwongo wa kiafya ulioskia...' : 'Type a health myth you heard...'}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const textarea = e.target as HTMLTextAreaElement;
                        if (textarea.value.trim()) {
                          handleMythDebunk(textarea.value);
                          textarea.value = '';
                        }
                      }
                    }}
                  ></textarea>
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold"
                      onClick={() => {
                        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                        if (textarea && textarea.value.trim()) {
                          handleMythDebunk(textarea.value);
                          textarea.value = '';
                        }
                      }}
                    >
                      {language === 'sw' ? 'Wasilisha kwa Uhakiki' : 'Submit for Verification'}
                    </button>
                    <button
                      onClick={() => startRecording('audio')}
                      disabled={isRecording}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title={language === 'sw' ? 'Rekodi Sauti' : 'Record Audio'}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowCameraCapture(true)}
                      disabled={isRecording}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title={language === 'sw' ? 'Pakia Picha' : 'Upload Image'}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={showCameraCapture}
        onClose={() => setShowCameraCapture(false)}
        onCapture={handleCameraCapture}
        title={language === 'sw' ? 'Piga Picha' : 'Take Photo'}
        context={language === 'sw' ? 'Piga picha ya dalili au ushahidi' : 'Take a photo of symptoms or evidence'}
      />
    </>
  );
};