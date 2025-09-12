interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

interface LanguageDetectionResponse {
  language: string;
  confidence: number;
}

class TranslationService {
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> {
    if (!text || text.trim() === '') return text;

    // If target language is English and source is auto, return original
    if (targetLanguage === 'en' && sourceLanguage === 'auto') {
      return text;
    }

    // Use mock translation
    return this.getMockTranslation(text, targetLanguage);
  }

  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    if (!text || text.trim() === '') {
      return { language: 'en', confidence: 0 };
    }

    // Enhanced language detection based on common words and patterns
    const detectedLang = this.enhancedLanguageDetection(text);
    return { language: detectedLang, confidence: 0.85 };
  }

  private enhancedLanguageDetection(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Kiswahili detection - enhanced patterns
    const swahiliWords = [
      'na', 'ya', 'wa', 'ni', 'kwa', 'za', 'la', 'mtu', 'watu', 'nyumbani', 'chakula', 'maji',
      'afya', 'jamii', 'watoto', 'mama', 'baba', 'shule', 'hospitali', 'daktari', 'ugonjwa',
      'dawa', 'chanjo', 'huduma', 'safari', 'gari', 'nyumba', 'kazi', 'pesa', 'bei', 'hujambo',
      'karibu', 'asante', 'pole', 'harambee', 'uhuru', 'jambo', 'habari', 'nzuri', 'sawa'
    ];
    const swahiliCount = swahiliWords.filter(word => lowerText.includes(word)).length;
    
    if (swahiliCount >= 2) {
      return 'sw';
    }
    
    return 'en'; // Default to English
  }

  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string[]> {
    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage, sourceLanguage))
    );
    return translations;
  }

  private getMockTranslation(text: string, targetLanguage: string): string {
    // Enhanced mock translations with more comprehensive coverage
    const mockTranslations: Record<string, Record<string, string>> = {
      'sw': {
        // Navigation & Common
        'Hello': 'Hujambo',
        'Welcome': 'Karibu',
        'Health': 'Afya',
        'Transport': 'Usafiri',
        'Emergency': 'Dharura',
        'Community': 'Jamii',
        'Thank you': 'Asante',
        'Good morning': 'Habari za asubuhi',
        'How are you?': 'Habari yako?',
        'I need help': 'Ninahitaji msaada',
        'I have fever and headache': 'Nina homa na maumivu ya kichwa',
        'I need emergency transport': 'Ninahitaji usafiri wa dharura',
        'My child needs vaccination': 'Mtoto wangu anahitaji chanjo',
        'Please help me': 'Tafadhali nisaidie',
        'Where is the hospital?': 'Hospitali iko wapi?',
        'I am sick': 'Mimi ni mgonjwa',
        'Call a doctor': 'Mwite daktari',
        'Medicine': 'Dawa',
        'Pain': 'Maumivu',
        'Fever': 'Homa',
        'Cough': 'Kikohozi',
        'Headache': 'Maumivu ya kichwa',
        'Stomach ache': 'Maumivu ya tumbo',
        'Diarrhea': 'Kuhara',
        'Vomiting': 'Kutapika',
        'Pregnant': 'Mjamzito',
        'Baby': 'Mtoto',
        'Child': 'Mtoto',
        'Mother': 'Mama',
        'Father': 'Baba',
        'Family': 'Familia',
        'Home': 'Nyumbani',
        'Hospital': 'Hospitali',
        'Clinic': 'Kliniki',
        'Doctor': 'Daktari',
        'Nurse': 'Muuguzi',
        'Vaccination': 'Chanjo',
        'Malaria': 'Malaria',
        'Water': 'Maji',
        'Food': 'Chakula',
        'Money': 'Pesa',
        'Help': 'Msaada',
        'Yes': 'Ndiyo',
        'No': 'Hapana',
        'Please': 'Tafadhali',
        'Sorry': 'Pole',
        'Excuse me': 'Samahani'
      }
    };

    const translations = mockTranslations[targetLanguage];
    if (translations && translations[text]) {
      return translations[text];
    }

    // If no specific translation found, return original text
    return text;
  }

  // Helper method to get language name in native script
  getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'sw': 'Kiswahili'
    };
    return languageNames[code] || code;
  }

  // Helper method to check if language is supported
  isLanguageSupported(code: string): boolean {
    const supportedLanguages = ['en', 'sw'];
    return supportedLanguages.includes(code);
  }

  // Method to get translation quality score
  getTranslationQuality(originalText: string, translatedText: string): number {
    if (originalText === translatedText) return 0.3; // Likely no translation occurred
    if (translatedText.length < originalText.length * 0.5) return 0.4; // Too short
    if (translatedText.length > originalText.length * 2) return 0.5; // Too long
    return 0.8; // Good translation
  }

  // Method to test connection
  async testConnection(): Promise<boolean> {
    // Always return true for mock service
    return true;
  }
}

export const translationService = new TranslationService();