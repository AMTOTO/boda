interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface BSenseAnalysis {
  healthRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  urgency: number;
  symptoms: string[];
  possibleConditions: string[];
  nextSteps: string[];
}

class OpenAIService {
  async analyzeHealthSymptoms(symptoms: string, patientInfo?: any): Promise<BSenseAnalysis> {
    // Use mock analysis since we removed external API dependencies
    return this.getMockAnalysis(symptoms);
  }

  async generateHealthEducation(topic: string, language: string = 'en'): Promise<string> {
    return this.getMockEducation(topic, language);
  }

  async debunkMyth(myth: string, language: string = 'en'): Promise<string> {
    return this.getMockMythDebunk(myth, language);
  }

  async chatWithAI(message: string, language: string = 'en', context: string = ''): Promise<string> {
    return this.getMockChatResponse(message, language);
  }

  private getMockAnalysis(symptoms: string): BSenseAnalysis {
    const symptomsList = symptoms.split(/[,;.]/).map(s => s.trim()).filter(s => s);
    const hasHighRiskSymptoms = /fever|difficulty breathing|chest pain|unconscious|bleeding|seizure|convulsion/i.test(symptoms);
    const hasMediumRiskSymptoms = /vomiting|diarrhea|headache|pain|cough|rash/i.test(symptoms);
    
    const riskLevel = hasHighRiskSymptoms ? 'high' : hasMediumRiskSymptoms ? 'medium' : 'low';
    const urgency = hasHighRiskSymptoms ? 8 : hasMediumRiskSymptoms ? 5 : 2;
    
    let possibleConditions: string[] = [];
    let recommendations: string[] = [];
    let nextSteps: string[] = [];
    
    if (/fever/i.test(symptoms)) {
      possibleConditions.push('Malaria', 'Viral infection', 'Bacterial infection');
      recommendations.push('Take paracetamol for fever', 'Stay hydrated', 'Rest');
      nextSteps.push('Visit nearest health facility for malaria test');
    }
    
    if (/cough/i.test(symptoms)) {
      possibleConditions.push('Common cold', 'Bronchitis', 'Pneumonia');
      recommendations.push('Drink warm fluids', 'Use honey for soothing throat');
      nextSteps.push('If cough persists for more than a week, seek medical attention');
    }
    
    if (/headache/i.test(symptoms)) {
      possibleConditions.push('Tension headache', 'Migraine', 'Sinusitis');
      recommendations.push('Rest in a quiet, dark room', 'Take paracetamol if needed');
      nextSteps.push('If severe or persistent, consult healthcare provider');
    }
    
    if (/diarrhea|vomiting/i.test(symptoms)) {
      possibleConditions.push('Gastroenteritis', 'Food poisoning');
      recommendations.push('Stay hydrated with ORS', 'Eat bland foods');
      nextSteps.push('Seek medical help if symptoms persist for more than 2 days');
    }
    
    if (/difficulty breathing|chest pain/i.test(symptoms)) {
      possibleConditions.push('Pneumonia', 'Asthma', 'Heart condition');
      recommendations.push('Seek immediate medical attention', 'Try to remain calm');
      nextSteps.push('Go to emergency room or call for help immediately');
    }
    
    // Default recommendations if none matched
    if (recommendations.length === 0) {
      recommendations = [
        'Rest and monitor symptoms',
        'Stay hydrated',
        'Take paracetamol for pain or fever if needed'
      ];
      nextSteps = [
        'Visit nearest health facility if symptoms worsen',
        'Follow up with community health volunteer'
      ];
      possibleConditions = ['Common viral infection', 'Minor ailment'];
    }

    return {
      healthRisk: riskLevel as 'low' | 'medium' | 'high' | 'critical',
      recommendations,
      urgency,
      symptoms: symptomsList.length > 0 ? symptomsList : ['General discomfort'],
      possibleConditions,
      nextSteps
    };
  }

  private getMockEducation(topic: string, language: string): string {
    const educationContent = {
      en: {
        vaccination: 'Vaccines protect you and your family from serious diseases. They are safe and effective. Make sure your children get all recommended vaccines on time. Vaccines work by teaching your body to recognize and fight specific germs. Common vaccines include those for polio, measles, tetanus, and tuberculosis. Side effects are usually mild and temporary. The benefits of vaccination far outweigh the risks.',
        malaria: 'Malaria is spread by mosquito bites. Use mosquito nets every night, especially for children and pregnant women. Clear stagnant water around your home where mosquitoes breed. Symptoms include fever, headache, and body aches. If you suspect malaria, get tested immediately at a health facility. Early treatment is important to prevent serious illness.',
        nutrition: 'Eat a balanced diet with fruits, vegetables, proteins, and grains. Breastfeed babies exclusively for 6 months. After 6 months, continue breastfeeding while adding nutritious foods. Children need protein-rich foods for growth. Pregnant women need extra iron and folic acid. Drink clean, safe water. Wash hands before preparing or eating food to prevent illness.',
        maternal: 'Pregnant women should attend at least 4 antenatal care visits. Eat a variety of nutritious foods and take iron supplements. Deliver your baby at a health facility with skilled birth attendants. After birth, attend postnatal check-ups. Exclusive breastfeeding for 6 months gives your baby the best start in life. Space pregnancies at least 2 years apart for mother\'s health.',
        child: 'Children need all recommended vaccines to stay healthy. Feed children a variety of foods including fruits, vegetables, and protein. Wash hands frequently to prevent infections. Take children for regular growth monitoring. Seek medical care promptly when a child is sick. Early childhood development includes talking, playing, and reading with your child.',
        hygiene: 'Wash hands with soap and water after using the toilet, before preparing food, and before eating. Use clean, safe water for drinking and cooking. Keep food preparation areas clean. Dispose of waste properly. Use latrines and keep them clean. Bathe regularly. Good hygiene prevents many illnesses including diarrhea and respiratory infections.'
      },
      sw: {
        vaccination: 'Chanjo zinakukinga wewe na familia yako dhidi ya magonjwa makubwa. Ni salama na zenye ufanisi. Hakikisha watoto wako wanapata chanjo zote za muhimu kwa wakati. Chanjo hufanya kazi kwa kufundisha mwili wako kutambua na kupambana na viini vya magonjwa. Chanjo za kawaida ni pamoja na polio, surua, pepopunda, na kifua kikuu. Madhara ni madogo na ya muda mfupi. Faida za chanjo ni kubwa zaidi kuliko hatari.',
        malaria: 'Malaria inasambazwa na kuumwa na mbu. Tumia chandarua kila usiku, hasa kwa watoto na wajawazito. Ondoa maji yaliyotulia karibu na nyumba yako ambako mbu wanazaliana. Dalili ni pamoja na homa, maumivu ya kichwa, na maumivu ya mwili. Ukishuku malaria, pima mara moja katika kituo cha afya. Matibabu ya mapema ni muhimu kuzuia ugonjwa mkali.',
        nutrition: 'Kula chakula chenye lishe ya uwiano na matunda, mboga, protini, na nafaka. Nyonyesha watoto kwa miezi 6 tu. Baada ya miezi 6, endelea kunyonyesha huku ukiongeza vyakula vyenye lishe. Watoto wanahitaji vyakula vyenye protini kwa ukuaji. Wajawazito wanahitaji chuma na asidi ya folic zaidi. Kunywa maji safi na salama. Osha mikono kabla ya kuandaa au kula chakula ili kuzuia magonjwa.',
        maternal: 'Wanawake wajawazito wanapaswa kuhudhuria angalau ziara 4 za huduma ya kabla ya kujifungua. Kula vyakula mbalimbali vyenye lishe na kuchukua virutubisho vya chuma. Jifungue katika kituo cha afya na wahudumu wenye ujuzi. Baada ya kujifungua, hudhuria uchunguzi wa baada ya kujifungua. Kunyonyesha kwa miezi 6 tu kunampa mtoto wako mwanzo bora maishani. Panga mimba angalau miaka 2 kwa afya ya mama.',
        child: 'Watoto wanahitaji chanjo zote zinazopendekezwa ili kuwa na afya. Lisha watoto vyakula mbalimbali ikiwa ni pamoja na matunda, mboga, na protini. Osha mikono mara kwa mara kuzuia maambukizi. Peleka watoto kwa ufuatiliaji wa ukuaji wa mara kwa mara. Tafuta huduma ya matibabu haraka mtoto anapougua. Maendeleo ya utotoni yanajumuisha kuzungumza, kucheza, na kusoma na mtoto wako.',
        hygiene: 'Osha mikono kwa sabuni na maji baada ya kutumia choo, kabla ya kuandaa chakula, na kabla ya kula. Tumia maji safi na salama kwa kunywa na kupika. Weka maeneo ya kuandaa chakula safi. Tupa taka ipasavyo. Tumia vyoo na viweke safi. Oga mara kwa mara. Usafi mzuri unazuia magonjwa mengi ikiwa ni pamoja na kuhara na maambukizi ya kupumua.'
      }
    };

    const lang = language === 'sw' ? 'sw' : 'en';
    const content = educationContent[lang];
    
    // Try to match the topic to our predefined content
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('vaccin') || topicLower.includes('chanjo')) {
      return content.vaccination;
    } else if (topicLower.includes('malaria') || topicLower.includes('malaria')) {
      return content.malaria;
    } else if (topicLower.includes('nutri') || topicLower.includes('lishe') || topicLower.includes('food') || topicLower.includes('chakula')) {
      return content.nutrition;
    } else if (topicLower.includes('maternal') || topicLower.includes('pregnan') || topicLower.includes('mjamzito') || topicLower.includes('mama')) {
      return content.maternal;
    } else if (topicLower.includes('child') || topicLower.includes('mtoto') || topicLower.includes('baby') || topicLower.includes('infant')) {
      return content.child;
    } else if (topicLower.includes('hygiene') || topicLower.includes('usafi') || topicLower.includes('clean')) {
      return content.hygiene;
    }
    
    // If no specific match, provide a general response
    return language === 'sw' 
      ? `Tafadhali tembelea kituo cha afya cha karibu kwa taarifa zaidi kuhusu ${topic}.`
      : `Please visit your nearest health facility for more information about ${topic}.`;
  }

  private getMockMythDebunk(myth: string, language: string): string {
    // Common health myths and their debunking
    const myths = {
      en: {
        vaccines: {
          myth: "Vaccines cause autism or other disabilities.",
          fact: "Scientific research has consistently shown that vaccines do not cause autism or other disabilities. Vaccines are thoroughly tested for safety before approval and are continuously monitored. Vaccines prevent serious diseases and save lives."
        },
        malaria: {
          myth: "Malaria is not spread by mosquitoes.",
          fact: "Malaria is definitely spread by female Anopheles mosquitoes. These mosquitoes carry the Plasmodium parasite, which causes malaria. Using mosquito nets, insect repellent, and eliminating standing water helps prevent malaria transmission."
        },
        traditional: {
          myth: "Traditional medicine is always better than modern medicine.",
          fact: "While some traditional remedies have medicinal properties, not all are effective or safe. Modern medicines are scientifically tested for safety and effectiveness. For serious conditions, it's important to seek proper medical care. Both approaches can sometimes work together under proper guidance."
        },
        covid: {
          myth: "COVID-19 is a hoax or not serious.",
          fact: "COVID-19 is a real and serious disease caused by the SARS-CoV-2 virus. It has affected millions worldwide and caused many deaths. Vaccines, masks, and social distancing help prevent its spread. Trust information from reliable health authorities."
        },
        hot_water: {
          myth: "Drinking hot water cures all diseases.",
          fact: "While staying hydrated is important for health, hot water alone cannot cure all diseases. Different illnesses require different treatments. For serious conditions, proper medical care is necessary. Hot drinks may help with some symptoms but are not a cure-all."
        }
      },
      sw: {
        vaccines: {
          myth: "Chanjo husababisha ulemavu au autism.",
          fact: "Utafiti wa kisayansi umeonyesha kuwa chanjo hazisababishi autism au ulemavu mwingine. Chanjo hupimwa kwa usalama kabla ya kuidhinishwa na hufuatiliwa mara kwa mara. Chanjo huzuia magonjwa makali na kuokoa maisha."
        },
        malaria: {
          myth: "Malaria haisambazwi na mbu.",
          fact: "Malaria kwa hakika inasambazwa na mbu wa kike wa Anopheles. Mbu hawa hubeba parasite ya Plasmodium, ambayo husababisha malaria. Kutumia vyandarua, dawa za kuua wadudu, na kuondoa maji yaliyosimama husaidia kuzuia maambukizi ya malaria."
        },
        traditional: {
          myth: "Dawa za asili ni bora kuliko dawa za kisasa.",
          fact: "Ingawa baadhi ya dawa za asili zina sifa za kimatibabu, si zote zinazofaa au salama. Dawa za kisasa hupimwa kisayansi kwa usalama na ufanisi. Kwa hali mbaya, ni muhimu kutafuta huduma bora ya matibabu. Njia zote mbili zinaweza wakati mwingine kufanya kazi pamoja chini ya mwongozo sahihi."
        },
        covid: {
          myth: "COVID-19 ni uwongo au si mbaya.",
          fact: "COVID-19 ni ugonjwa halisi na mbaya unaosababishwa na virusi vya SARS-CoV-2. Umeathiri mamilioni duniani kote na kusababisha vifo vingi. Chanjo, barakoa, na kutunza umbali husaidia kuzuia kuenea kwake. Amini taarifa kutoka kwa mamlaka za afya zinazotegemewa."
        },
        hot_water: {
          myth: "Kunywa maji ya moto kunaponya magonjwa yote.",
          fact: "Ingawa kunywa maji ni muhimu kwa afya, maji ya moto pekee hayawezi kuponya magonjwa yote. Magonjwa tofauti yanahitaji matibabu tofauti. Kwa hali mbaya, huduma bora ya matibabu ni muhimu. Vinywaji vya moto vinaweza kusaidia na baadhi ya dalili lakini si tiba ya kila kitu."
        }
      }
    };

    const lang = language === 'sw' ? 'sw' : 'en';
    const mythsInLanguage = myths[lang];
    
    // Try to match the myth to our predefined content
    const mythLower = myth.toLowerCase();
    let response = '';
    
    if (mythLower.includes('vaccine') || mythLower.includes('chanjo') || mythLower.includes('autism')) {
      response = `${mythsInLanguage.vaccines.myth}\n\n${mythsInLanguage.vaccines.fact}`;
    } else if (mythLower.includes('malaria') || mythLower.includes('mosquito') || mythLower.includes('mbu')) {
      response = `${mythsInLanguage.malaria.myth}\n\n${mythsInLanguage.malaria.fact}`;
    } else if (mythLower.includes('traditional') || mythLower.includes('asili') || mythLower.includes('modern')) {
      response = `${mythsInLanguage.traditional.myth}\n\n${mythsInLanguage.traditional.fact}`;
    } else if (mythLower.includes('covid') || mythLower.includes('corona')) {
      response = `${mythsInLanguage.covid.myth}\n\n${mythsInLanguage.covid.fact}`;
    } else if (mythLower.includes('hot water') || mythLower.includes('maji ya moto')) {
      response = `${mythsInLanguage.hot_water.myth}\n\n${mythsInLanguage.hot_water.fact}`;
    } else {
      // Generic response if no specific myth is matched
      response = language === 'sw' 
        ? `Uwongo: "${myth}"\n\nUkweli: Hii inaweza kuwa taarifa isiyo sahihi. Tafadhali fuata ushauri wa kitaalamu wa afya na usitegemee habari zisizo za ukweli. Tembelea kituo cha afya cha karibu kwa taarifa sahihi.`
        : `Myth: "${myth}"\n\nFact: This may be incorrect information. Please follow professional medical advice and don't rely on unverified information. Visit your nearest health facility for accurate information.`;
    }
    
    return response;
  }

  private getMockChatResponse(message: string, language: string): string {
    const messageLower = message.toLowerCase();
    
    // Common health questions and responses
    if (messageLower.includes('fever') || messageLower.includes('homa')) {
      return language === 'sw'
        ? "Homa inaweza kusababishwa na maambukizi mbalimbali, ikiwa ni pamoja na malaria, mafua, au maambukizi ya bakteria. Pumzika, kunywa maji mengi, na kuchukua paracetamol inaweza kusaidia. Ikiwa homa ni kali au inaendelea kwa zaidi ya siku mbili, tafadhali tembelea kituo cha afya."
        : "Fever can be caused by various infections, including malaria, flu, or bacterial infections. Rest, drink plenty of fluids, and taking paracetamol can help. If the fever is severe or persists for more than two days, please visit a health facility.";
    }
    
    if (messageLower.includes('headache') || messageLower.includes('kichwa')) {
      return language === 'sw'
        ? "Maumivu ya kichwa yanaweza kusababishwa na msongo wa mawazo, uchovu, njaa, au maambukizi. Pumzika, kunywa maji, na kuchukua paracetamol inaweza kusaidia. Ikiwa maumivu ni makali au ya mara kwa mara, tafadhali tafuta ushauri wa matibabu."
        : "Headaches can be caused by stress, fatigue, hunger, or infections. Rest, hydration, and taking paracetamol can help. If the headache is severe or frequent, please seek medical advice.";
    }
    
    if (messageLower.includes('pregnancy') || messageLower.includes('mjamzito') || messageLower.includes('mimba')) {
      return language === 'sw'
        ? "Ni muhimu kuhudhuria kliniki ya wajawazito (ANC) angalau mara 4 wakati wa ujauzito. Kula chakula chenye lishe, kunywa maji mengi, na kupumzika vya kutosha. Hakikisha unapata virutubisho vya chuma na asidi ya folic. Jifungue katika kituo cha afya kwa usalama wako na mtoto wako."
        : "It's important to attend antenatal clinic (ANC) at least 4 times during pregnancy. Eat nutritious food, drink plenty of water, and get adequate rest. Make sure to get iron and folic acid supplements. Deliver at a health facility for your safety and your baby's.";
    }
    
    if (messageLower.includes('malaria')) {
      return language === 'sw'
        ? "Malaria husababishwa na kuumwa na mbu. Dalili ni pamoja na homa, maumivu ya kichwa, na maumivu ya mwili. Kinga bora ni kutumia chandarua kila usiku na kuondoa maji yaliyosimama karibu na nyumba. Ikiwa unashuku una malaria, pata kipimo haraka katika kituo cha afya."
        : "Malaria is caused by mosquito bites. Symptoms include fever, headache, and body aches. The best prevention is using a mosquito net every night and removing standing water near your home. If you suspect malaria, get tested promptly at a health facility.";
    }
    
    if (messageLower.includes('diarrhea') || messageLower.includes('kuhara')) {
      return language === 'sw'
        ? "Kuhara kunaweza kusababishwa na maambukizi, chakula au maji yaliyochafuliwa. Kunywa maji mengi na ORS (Oral Rehydration Solution) ili kuzuia upungufu wa maji mwilini. Endelea kula chakula. Ikiwa kuhara ni kali au kunaendelea kwa zaidi ya siku mbili, tafuta matibabu."
        : "Diarrhea can be caused by infections, contaminated food or water. Drink plenty of fluids and ORS (Oral Rehydration Solution) to prevent dehydration. Continue eating food. If diarrhea is severe or continues for more than two days, seek treatment.";
    }
    
    if (messageLower.includes('vaccination') || messageLower.includes('vaccine') || messageLower.includes('chanjo')) {
      return language === 'sw'
        ? "Chanjo ni muhimu kwa afya ya mtoto wako. Hakikisha mtoto wako anapata chanjo zote zinazopendekezwa kwa wakati. Chanjo hulinda dhidi ya magonjwa hatari kama polio, surua, na kifaduro. Madhara madogo kama homa ndogo ni ya kawaida na huisha haraka."
        : "Vaccines are essential for your child's health. Make sure your child gets all recommended vaccines on time. Vaccines protect against dangerous diseases like polio, measles, and tetanus. Minor side effects like mild fever are normal and resolve quickly.";
    }
    
    // Default response if no specific topic is matched
    return language === 'sw'
      ? "Asante kwa swali lako. Ninaweza kukusaidia na maswali kuhusu afya, usafiri wa afya, na huduma za jamii. Tafadhali uliza swali lolote kuhusu afya yako au huduma zetu."
      : "Thank you for your question. I can help with questions about health, health transport, and community services. Please feel free to ask any question about your health or our services.";
  }
}

export const openaiService = new OpenAIService();
export type { BSenseAnalysis };