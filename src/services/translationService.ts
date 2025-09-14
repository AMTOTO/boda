interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

interface LanguageDetectionResponse {
  language: string;
  confidence: number;
}

interface NLLBTranslationRequest {
  input_text: string;
  target_language: string;
  source_language?: string;
}

interface NLLBTranslationResponse {
  translation: string;
  source_language: string;
  target_language: string;
  processing_time: number;
}

class TranslationService {
  private apiKey: string;
  private nllbApiUrl: string;
  private fallbackURL = 'https://translate.googleapis.com/translate_a/single';

  constructor() {
    // Use environment variable for your hosted NLLB translation API
    this.nllbApiUrl = import.meta.env.VITE_NLLB_API_URL || 'https://boda-ctd9.onrender.com/';
    this.apiKey = import.meta.env.VITE_LANGUAGE_API_KEY || 'free-tier';
    
    if (this.nllbApiUrl) {
      console.log('Using advanced NLLB translation service for Kenyan languages');
    } else {
      console.warn('NLLB API URL not configured. Add VITE_NLLB_API_URL to environment variables');
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> {
    if (!text || text.trim() === '') return text;

    // If target language is English and source is auto, return original
    if (targetLanguage === 'en' && sourceLanguage === 'auto') {
      return text;
    }

    try {
      // First try NLLB API for Kenyan languages
      if (this.isKenyanLanguage(targetLanguage)) {
        const nllbResult = await this.tryNLLBTranslation(text, targetLanguage, sourceLanguage);
        if (nllbResult) return nllbResult;
      }

      // Fallback to other translation services
      const googleResult = await this.tryGoogleTranslation(text, targetLanguage, sourceLanguage);
      if (googleResult) return googleResult;

      // Final fallback to enhanced mock translation
      return this.getMockTranslation(text, targetLanguage);
    } catch (error) {
      console.error('Translation API error:', error);
      return this.getMockTranslation(text, targetLanguage);
    }
  }

  private async tryNLLBTranslation(text: string, targetLanguage: string, sourceLanguage: string): Promise<string | null> {
    try {
      if (!this.nllbApiUrl) {
        return null; // Skip if not configured
      }

      const nllbLangCode = this.mapToNLLBLanguageCode(targetLanguage);
      const sourceLangCode = sourceLanguage === 'auto' ? 'eng_Latn' : this.mapToNLLBLanguageCode(sourceLanguage);
      
      if (!nllbLangCode) return null;

      const requestBody: NLLBTranslationRequest = {
        input_text: text,
        target_language: nllbLangCode,
        source_language: sourceLangCode || 'eng_Latn'
      };

      const response = await fetch(`${this.nllbApiUrl}translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey !== 'free-tier' ? `Bearer ${this.apiKey}` : ''
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.warn(`NLLB API error: ${response.status}`);
        return null;
      }

      const data: NLLBTranslationResponse = await response.json();
      
      if (data.translation && data.translation.trim() !== text.trim()) {
        return data.translation;
      }
      
      return null;
    } catch (error) {
      console.warn('NLLB translation failed:', error);
      return null;
    }
  }

  private mapToNLLBLanguageCode(code: string): string | null {
    // NLLB language codes for Kenyan languages
    const nllbMapping: Record<string, string> = {
      'sw': 'swh_Latn', // Swahili
      'ki': 'kik_Latn', // Kikuyu
      'luo': 'luo_Latn', // Luo
      'luy': 'luy_Latn', // Luhya
      'kam': 'kam_Latn', // Kamba
      'som': 'som_Latn', // Somali
      'rw': 'kin_Latn', // Kinyarwanda
      'en': 'eng_Latn'  // English
    };
    return nllbMapping[code] || null;
  }

  private isKenyanLanguage(code: string): boolean {
    const kenyanLanguages = ['sw', 'ki', 'luo', 'luy', 'kal', 'kam', 'mer', 'mas', 'som', 'rw'];
    return kenyanLanguages.includes(code);
  }

  private async tryGoogleTranslation(text: string, targetLanguage: string, sourceLanguage: string): Promise<string | null> {
    try {
      const sl = sourceLanguage === 'auto' ? 'auto' : this.mapLanguageCode(sourceLanguage);
      const tl = this.mapLanguageCode(targetLanguage);
      
      const url = `${this.fallbackURL}?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Google Translate error: ${response.status}`);

      const data = await response.json();
      
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
      return null;
    } catch (error) {
      console.warn('Google Translate failed:', error);
      return null;
    }
  }

  private mapLanguageCode(code: string): string {
    const mapping: Record<string, string> = {
      'sw': 'sw',
      'ki': 'sw', // Kikuyu -> Swahili (closest available)
      'luo': 'sw', // Luo -> Swahili
      'luy': 'sw', // Luhya -> Swahili
      'kal': 'sw', // Kalenjin -> Swahili
      'kam': 'sw', // Kamba -> Swahili
      'mer': 'sw', // Meru -> Swahili
      'mas': 'sw', // Maasai -> Swahili
      'som': 'so', // Somali
      'rw': 'rw', // Kinyarwanda
      'en': 'en'
    };
    return mapping[code] || 'en';
  }

  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    if (!text || text.trim() === '') {
      return { language: 'en', confidence: 0 };
    }

    try {
      // Enhanced language detection based on common words and patterns
      const detectedLang = this.enhancedLanguageDetection(text);
      return { language: detectedLang, confidence: 0.85 };
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'en', confidence: 0.5 };
    }
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
    
    // Kikuyu detection - enhanced with more words
    const kikuyuWords = [
      'na', 'wa', 'gĩ', 'kĩ', 'mũ', 'nĩ', 'rĩ', 'gũ', 'thĩ', 'nyũmba', 'mũciĩ', 'ũgima',
      'gĩkũyũ', 'mwana', 'mũtumia', 'mũndũ', 'andũ', 'mũgũnda', 'irio', 'maaĩ', 'wĩ', 'mwega',
      'wamũkĩra', 'nĩ', 'wega', 'gĩthimi', 'ciana', 'nyina', 'ithe', 'mbeca', 'sukulu'
    ];
    const kikuyuCount = kikuyuWords.filter(word => lowerText.includes(word)).length;
    
    // Luo detection - enhanced
    const luoWords = [
      'gi', 'ma', 'ne', 'to', 'kod', 'ka', 'ji', 'dhano', 'ot', 'pi', 'dala', 'nyako',
      'wuon', 'min', 'nyathi', 'skul', 'hospitali', 'janam', 'chiemo', 'pi', 'nadi',
      'erokamano', 'oyawore', 'ee', 'ooyo', 'kawuono', 'kiny', 'oganda', 'joode'
    ];
    const luoCount = luoWords.filter(word => lowerText.includes(word)).length;
    
    // Luhya detection - enhanced
    const luhyaWords = [
      'khu', 'bu', 'ba', 'mu', 'li', 'ka', 'kho', 'ekholo', 'omuntu', 'abantu',
      'enyumba', 'obulamu', 'abaana', 'mama', 'papa', 'sukulu', 'hospitali', 'muraho',
      'webare', 'eee', 'nende', 'lelo', 'muno', 'khaya', 'amaka', 'amanji', 'obusuma'
    ];
    const luhyaCount = luhyaWords.filter(word => lowerText.includes(word)).length;
    
    // Kalenjin detection - enhanced
    const kalenjinWords = [
      'ak', 'ko', 'che', 'kip', 'kal', 'en', 'kokwet', 'biik', 'lakwet',
      'chepyosok', 'kibagenge', 'sukul', 'hospitali', 'ng\'alek', 'keny', 'koik',
      'kipsir', 'kimuktaindet', 'chepsiriet', 'chepsoriet', 'kiruogindet', 'walak'
    ];
    const kalenjinCount = kalenjinWords.filter(word => lowerText.includes(word)).length;
    
    // Kamba detection - enhanced
    const kambaWords = [
      'kĩ', 'mũ', 'ma', 'nĩ', 'wa', 'kũ', 'mbaĩ', 'mũndũ', 'andũ', 'nyũmba',
      'mũsyĩ', 'ũtũũ', 'mwana', 'aka', 'ũkũũ', 'sukulu', 'hospitali', 'tonyoka',
      'andĩka', 'aĩthi', 'aongoi', 'kĩlonzo', 'mĩsyi', 'kũthiũka', 'matũma'
    ];
    const kambaCount = kambaWords.filter(word => lowerText.includes(word)).length;
    
    // Somali detection - enhanced
    const somaliWords = [
      'iyo', 'oo', 'ah', 'ka', 'la', 'ku', 'qof', 'dad', 'guri', 'caafimaad',
      'caruur', 'hooyada', 'aabbaha', 'dugsiga', 'isbitaal', 'dhakhtar', 'salaan',
      'soo', 'dhaweyn', 'gaadiidka', 'degdeg', 'bulshada', 'dulmar', 'qoys', 'biyo'
    ];
    const somaliCount = somaliWords.filter(word => lowerText.includes(word)).length;
    
    // Kinyarwanda detection - enhanced
    const kinyarwandaWords = [
      'na', 'ni', 'ku', 'mu', 'ba', 'ki', 'bi', 'umuryango', 'umuntu', 'abantu',
      'inzu', 'ubuzima', 'abana', 'mama', 'papa', 'ishuri', 'ibitaro', 'muraho',
      'murakaza', 'neza', 'ubwikorezi', 'byihutirwa', 'incamake', 'amazi', 'ibiryo'
    ];
    const kinyarwandaCount = kinyarwandaWords.filter(word => lowerText.includes(word)).length;

    // Determine language based on highest count
    const scores = [
      { lang: 'sw', count: swahiliCount },
      { lang: 'ki', count: kikuyuCount },
      { lang: 'luo', count: luoCount },
      { lang: 'luy', count: luhyaCount },
      { lang: 'kal', count: kalenjinCount },
      { lang: 'kam', count: kambaCount },
      { lang: 'som', count: somaliCount },
      { lang: 'rw', count: kinyarwandaCount }
    ];

    const maxScore = scores.reduce((max, current) => current.count > max.count ? current : max);
    
    if (maxScore.count >= 2) {
      return maxScore.lang;
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
        'My child needs vaccination': 'Mtoto wangu anahitaji chanjo'
      },
      'ki': {
        'Hello': 'Wĩ mwega',
        'Welcome': 'Wamũkĩra',
        'Health': 'Ũgima',
        'Transport': 'Gũthiũra',
        'Emergency': 'Kĩhĩtũka',
        'Community': 'Gĩkũyũ',
        'Thank you': 'Nĩ wega',
        'I have fever and headache': 'Ndĩ na homa na maumivu ma kĩchwa',
        'I need emergency transport': 'Nĩndĩbataire gũthiũra kwa kĩhĩtũka',
        'My child needs vaccination': 'Mwana wakwa nĩabataire chanjo'
      },
      'luo': {
        'Hello': 'Nadi',
        'Welcome': 'Karibu',
        'Health': 'Ngima',
        'Transport': 'Wuoth',
        'Emergency': 'Kech',
        'Community': 'Oganda',
        'Thank you': 'Erokamano',
        'I have fever and headache': 'An gi liet kod rem mar wi',
        'I need emergency transport': 'Adwaro wuoth mar kech',
        'My child needs vaccination': 'Nyathina dwaro chanjo'
      },
      'som': {
        'Hello': 'Salaan',
        'Welcome': 'Soo dhaweyn',
        'Health': 'Caafimaad',
        'Transport': 'Gaadiidka',
        'Emergency': 'Degdeg',
        'Community': 'Bulshada',
        'Thank you': 'Mahadsanid',
        'I have fever and headache': 'Waxaan qabaa qandho iyo madax xanuun',
        'I need emergency transport': 'Waxaan u baahanahay gaadiid degdeg ah',
        'My child needs vaccination': 'Ilmahaygii wuxuu u baahan yahay tallaal'
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
      'sw': 'Kiswahili',
      'ki': 'Gĩkũyũ',
      'luo': 'Dholuo',
      'luy': 'Luluhya',
      'kal': 'Kalenjin',
      'kam': 'Kikamba',
      'mer': 'Kimeru',
      'mas': 'Maa',
      'som': 'Soomaali',
      'rw': 'Ikinyarwanda'
    };
    return languageNames[code] || code;
  }

  // Helper method to check if language is supported
  isLanguageSupported(code: string): boolean {
    const supportedLanguages = ['en', 'sw', 'ki', 'luo', 'luy', 'kal', 'kam', 'mer', 'mas', 'som', 'rw'];
    return supportedLanguages.includes(code);
  }

  // Method to get translation quality score
  getTranslationQuality(originalText: string, translatedText: string): number {
    if (originalText === translatedText) return 0.3; // Likely no translation occurred
    if (translatedText.length < originalText.length * 0.5) return 0.4; // Too short
    if (translatedText.length > originalText.length * 2) return 0.5; // Too long
    return 0.8; // Good translation
  }

  // Method to test NLLB API connection
  async testNLLBConnection(): Promise<boolean> {
    try {
      if (!this.nllbApiUrl) {
        return false;
      }

      const response = await fetch(`${this.nllbApiUrl}health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.warn('NLLB API connection test failed:', error);
      return false;
    }
  }
}

export const translationService = new TranslationService();
export type { TranslationResponse, LanguageDetectionResponse };