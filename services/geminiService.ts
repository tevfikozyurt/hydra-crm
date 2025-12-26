import { GoogleGenAI, Type } from "@google/genai";
import { KPI, Anomaly, AIAnalysisResult, GamificationStats, TechStats, FinancialStats, BenchmarkStats, SimulationParams, SimulationStats, B2BStats } from "../types";

// Helper to get the API key safely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

// Genel Sistem Analizi (COMMAND VIEW)
export const analyzeSystemStatus = async (
  kpis: KPI[],
  anomalies: Anomaly[],
  selectedTime: string
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key missing. Returning mock data.");
    return {
      riskLevel: 'HIGH',
      summary: "Adana Bölgesi - 102 Numaralı Blokta, gece 03:00-05:00 saatleri arasında şebeke kullanım dışıyken 12L/dk sabit debili 'Sessiz Sızıntı' tespit edildi.",
      actionItems: [
        "Saha ekibine (Belediye/Site Yönetimi) 102. Blok için acil 'Akustik Dinleme' iş emri açın.",
        "Bölgesel basınç düşürücü vanaları (PRV) %10 kısarak sızıntı debisini geçici olarak düşürün.",
        "Site yöneticisine otomatik SMS ile bilgilendirme yapın."
      ],
      priorityRegion: "Adana/Seyhan",
      projectedImpact: "Müdahale sonrası haftalık su kaybı %5 oranında azalacak ve tahmini 45.000 TL/Yıl tasarruf sağlanacak."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemContext = `
    Sen HYDRA-AI, Su Yönetim Strateji Danışmanısın.
    Üslup: Net, Otoriter, Çözüm Odaklı (McKinsey/BCG Raporu gibi).
    
    Veri Bağlamı: ${selectedTime} zaman dilimindeki genel sistem verileri.
    KPI'lar: ${JSON.stringify(kpis)}
    Anomaliler: ${JSON.stringify(anomalies)}
    
    Görevler:
    1. 'summary': En kritik operasyonel sorunu (Diagnosis) tek cümleyle tanımla.
    2. 'actionItems': Bu sorunu çözmek için 3 adımda uygulanabilir, stratejik bir reçete yaz.
    3. 'projectedImpact': Bu aksiyonlar alınırsa elde edilecek sayısal kazanımı (Su, Para veya Risk Azalması) belirt.
    
    TÜM ÇIKTILARI TÜRKÇE OLARAK VER.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      riskLevel: 'CRITICAL',
      summary: "AI Servis Bağlantı Hatası. Manuel kontrol gerekli.",
      actionItems: ["Bağlantıyı kontrol et", "Manuel modda devam et"],
      priorityRegion: "Bilinmiyor",
      projectedImpact: "Veri yok."
    };
  }
};

// Sızıntı ve Anomali Önceliklendirme Analizi (ZERO LEAKAGE SECTION)
export const analyzeAnomalyPriority = async (
  timeFilter: string
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'CRITICAL',
      summary: "Konya Sanayi Bölgesi ana isale hattında, üretim saatleri dışında (Haftasonu) beklenmedik debi artışı var. Patent kaynaklı gizli çatlak şüphesi.",
      actionItems: [
        "BUSKİ acil müdahale ekibini Seyhan sektörüne yönlendir (Kod: Kırmızı).",
        "Bölgesel vanaları %40 kısarak basıncı düşür ve boru patlama riskini azalt.",
        "Sanayi odasına 'Şebeke Bakım' uyarısı gönder."
      ],
      priorityRegion: "Konya/Sanayi",
      projectedImpact: "Erken müdahale ile ana boru patlaması ve ~2 Milyon TL'lik altyapı hasarı %95 olasılıkla önlenecek."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Sızıntı Yönetim Uzmanısın.
    Odak: "Sıfır Sızıntı" ve "Varlık Koruma".
    
    Senaryo: Son ${timeFilter} içinde tespit edilen sızıntıların paternlerini analiz ediyorsun.
    
    Format:
    - Summary: Sorunun kök nedeni (Örn: Gece Akışı, Basınç Patlaması).
    - Actions: Saha ekiplerine verilecek net emirler.
    - Impact: Kurtarılan suyun m3 veya TL karşılığı.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    return {
      riskLevel: 'HIGH',
      summary: "AI Servis Hatası.",
      actionItems: ["Manuel kontrol sağlayın"],
      priorityRegion: "Sistem Hatası",
      projectedImpact: "Hesaplamıyor"
    };
  }
};

// Davranış Değişikliği Kampanya Analizi (LAB VIEW)
export const analyzeGamificationStrategy = async (
  stats: GamificationStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'MODERATE',
      summary: "Veri Analizi: En yüksek tüketime sahip %20'lik 'Lüks Segment' kullanıcıları, mevcut çevreci mesajlara ve puan sistemine duyarsız kalıyor.",
      actionItems: [
        "Bu segmente özel, tasarrufun faturaya etkisini TL bazında gösteren 'Cüzdan Avcısı' (Wallet Hunter) rozetini devreye alın.",
        "Komşularla anonim kıyaslama yapan 'Rekabetçi Rapor' bildirimlerini aktifleştirin.",
        "Tasarruf edenlere emlak vergisi indirimi gibi yerel yönetim teşvikleri sunun."
      ],
      priorityRegion: "Lüks Konut Segmenti",
      projectedImpact: "Hedef kitlenin (High-Rollers) tüketiminde %12 azalma ve kampanya katılımında %35 artış öngörülüyor."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Davranış Bilimleri Danışmanısın (Behavioral Scientist).
    
    Veriler:
    - AI tasarruf farkı: %${stats.aiSavingsDelta}
    - Toplam Etki: ${stats.impactTrees} Ağaç
    
    Görev:
    1. 'summary': Katılım göstermeyen veya çok tüketen segmentin davranışsal engelini tanımla.
    2. 'actionItems': Nudge Theory (Dürtme) kullanarak 3 spesifik kampanya/rozet önerisi sun.
    3. 'projectedImpact': Beklenen davranış değişikliği oranını belirt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'LOW',
      summary: "Analiz servisine erişilemiyor.",
      actionItems: ["Bağlantıyı kontrol et"],
      priorityRegion: "Yok",
      projectedImpact: "-"
    };
  }
};

// Altyapı Optimizasyonu Analizi (TECH VIEW)
export const analyzeInfrastructureOptimization = async (
  stats: TechStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'HIGH',
      summary: "Ankara/Mamak Sektör-3 bölgesinde sinyal zayıflığı (RSSI < -120dB) nedeniyle %15 veri paketi kaybı yaşanıyor. Bu durum sızıntı tespit süresini 4 saat geciktiriyor.",
      actionItems: [
        "Mamak Sektör-3'teki kör noktaya 1 adet ek LoRaWAN Gateway kurulumu planlayın.",
        "Pili %10'un altına düşen 240 cihaz için 'Önleyici Batarya Değişimi' rotası oluşturun.",
        "Betonarme yoğunluğu yüksek alanlarda modüllerin anten kazanç (SF) ayarlarını uzaktan artırın."
      ],
      priorityRegion: "Ankara/Mamak",
      projectedImpact: "Veri kaybı %1'in altına düşecek ve sızıntı tespit hızı 4 saatten 15 dakikaya inecek."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Teknik Operasyonlar Liderisin (CTO).
    
    Veri: ${JSON.stringify(stats)}
    
    Görev:
    1. 'summary': Altyapıdaki en büyük darboğazı (Sinyal/Pil/Offline) belirle.
    2. 'actionItems': OpEx (Operasyonel Gider) düşürücü ve kapsama artırıcı teknik çözümler sun.
    3. 'projectedImpact': Sistemin güvenilirliği (Reliability) üzerindeki etkiyi ölçümle.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'MODERATE',
      summary: "Teknik analiz servisi şu an meşgul.",
      actionItems: ["Manuel ağ taraması yapın"],
      priorityRegion: "Genel Ağ",
      projectedImpact: "-"
    };
  }
};

// Finansal Strateji Analizi (FINANCE VIEW)
export const analyzeFinancialStrategy = async (
  stats: FinancialStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'LOW',
      summary: "Gelir Dağılımı Riski: Kurumsal API gelirleri mevcut hedeflerin %15 gerisinde kalmıştır. B2B veri satış potansiyeli tam kullanılamıyor.",
      actionItems: [
        "Bursa Akıllı Şehir projesi için 'Anonimleştirilmiş Toplu Tüketim Verisi' teklifini ve entegrasyon paketini sunun.",
        "Büyük site yönetimleri için donanım maliyetini sıfırlayan 'Kullandıkça Öde' (SaaS) modeline geçişi hızlandırın.",
        "Sigorta şirketlerine yönelik 'Su Hasarı Risk Skoru' API'sini pazara sunun."
      ],
      priorityRegion: "Bursa/Kurumsal",
      projectedImpact: "API ve SaaS gelir kalemlerinde %25 artış ile aylık tekrarlayan gelir (MRR) dengelenecek."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Finansal Strateji Danışmanısın (CFO Consultant).
    
    Veri: ${JSON.stringify(stats)}
    
    Görev:
    1. 'summary': Gelir modelindeki veya ROI'daki eksikliği teşhis et.
    2. 'actionItems': Gelir çeşitlendirmesi (SaaS, API) için kurumsal stratejiler öner.
    3. 'projectedImpact': Finansal büyüme (Revenue Growth) veya ROI üzerindeki etkiyi belirt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'MODERATE',
      summary: "Finansal analiz servisi şu an meşgul.",
      actionItems: ["Manuel gelir tablosu kontrolü"],
      priorityRegion: "Genel Finans",
      projectedImpact: "-"
    };
  }
};

// Karşılaştırmalı Analiz (BENCHMARK VIEW)
export const analyzeBenchmarkStrategy = async (
  stats: BenchmarkStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'LOW', // LOW risk is GOOD here
      summary: "Tasarruf İvmesi: Hydra kullanıcıları, bölgesel ortalamadan %18 daha verimli su kullanıyor. Fark giderek kapanıyor, bu da diğer kullanıcıların da tasarrufa yöneldiğini gösteriyor.",
      actionItems: [
        "Başarılı tasarruf ipuçlarını (AI tarafından belirlenen) tüm bölge kullanıcılarına 'Push Bildirimi' olarak gönder.",
        "Bursa Pilot bölgesindeki %12'lik verimlilik artışını vaka analizi (Case Study) olarak yayınla.",
        "İstanbul bölgesinde tüketimi artan sitelere 'Akıllı Vana' kiralama teklifi sun."
      ],
      priorityRegion: "Tüm Bölgeler",
      projectedImpact: "Bölgesel farkındalık kampanyası ile genel su tüketiminde %5 ek düşüş sağlanacak."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Veri Analisti ve İletişim Uzmanısın.
    
    Odak: Kıyaslama (Benchmarking) ve Motivasyon.
    
    Veri: ${JSON.stringify(stats)}
    
    Görev:
    1. 'summary': Hydra kullanıcıları ile genel ortalama arasındaki farkı yorumla. İvmeyi analiz et.
    2. 'actionItems': Bu farkı korumak veya açmak için iletişim ve teknoloji aksiyonları öner.
    3. 'projectedImpact': Toplumsal su bilinci üzerindeki etkiyi öngör.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'LOW',
      summary: "Kıyaslama servisi geçici olarak çevrimdışı.",
      actionItems: ["Veri akışını kontrol et"],
      priorityRegion: "Kıyaslama",
      projectedImpact: "-"
    };
  }
};

// Simülasyon Analizi (SIMULATOR VIEW)
export const analyzeSimulationScenario = async (
  params: SimulationParams,
  results: SimulationStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // Mock logic for offline
    let risk = 'MODERATE';
    if (results.scarcityRisk > 80) risk = 'CRITICAL';
    else if (results.scarcityRisk > 50) risk = 'HIGH';

    return {
      riskLevel: risk as any,
      summary: `Bu senaryoda, nüfus artışına rağmen AI benimsemesi %${params.aiAdoption} seviyesine ulaşırsa, Su Kıtlığı eşiğine ulaşma süresi 2.4 yıl uzayacaktır.`,
      actionItems: [
        "Fiyatlandırmayı %10 artırarak talep esnekliğini test edin.",
        `Kuraklık senaryosunda (Yağış: ${params.rainfall}) baraj rezervlerini korumak için tarımsal sulama kısıtlamalarını devreye alın.`,
        "Yüksek nüfus artışı bölgelerinde (İstanbul) gri su geri kazanım sistemlerini zorunlu kılın."
      ],
      priorityRegion: "Gelecek Projeksiyonu",
      projectedImpact: "Kriz yönetimi stratejisinin dayanıklılığı %35 artırılabilir."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI Gelecek Senaryo Analistisin (Futurist Risk Manager).
    
    Kullanıcı bir "What-If" simülasyonu çalıştırdı.
    Girdiler:
    - Fiyat Değişimi: %${params.pricingChange}
    - AI Benimseme: %${params.aiAdoption}
    - Yağış Durumu: ${params.rainfall}
    - Nüfus Artışı: %${params.populationGrowth}
    
    Sonuçlar:
    - Kıtlığa Kalan Süre: ${results.yearsToScarcity} Yıl
    - Kıtlık Riski: %${results.scarcityRisk}
    
    Görev:
    1. 'summary': Bu senaryonun en çarpıcı sonucunu (Data Storytelling) anlat. Örn: "AI benimsemesi artmasına rağmen kuraklık etkisi baskın geliyor."
    2. 'actionItems': Kriz süresini uzatmak veya riski düşürmek için 3 stratejik hamle öner.
    3. 'projectedImpact': Risk seviyesindeki veya süredeki potansiyel iyileşmeyi belirt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'MODERATE',
      summary: "Simülasyon motoru çevrimdışı.",
      actionItems: ["Parametreleri değiştirip tekrar deneyin"],
      priorityRegion: "Simülasyon",
      projectedImpact: "-"
    };
  }
};

// B2B Etki Analizi (B2B VIEW)
export const analyzeB2BImpact = async (
  stats: B2BStats
): Promise<AIAnalysisResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      riskLevel: 'LOW', // B2B için "Risk" burada "Fırsat" anlamında tersine kullanılabilir veya sadece operasyonel durum. LOW risk = İyi durum.
      summary: "Yerel Güçlenme: Bursa pilot bölgesindeki belediye entegrasyonu (Faz 3), ortak alan su kaçaklarını %45 oranında azaltarak operasyonel verimlilikte rekor kırdı.",
      actionItems: [
        "Belediyelerle 'Anonimleştirilmiş Mahalle Tüketim Haritası'nı paylaşarak altyapı bakım önceliklerini belirleyin.",
        "Site yönetimlerine, ortak alanlardaki (havuz, bahçe) sızıntıları otomatik kapatan 'Akıllı Vana' kiralama modeli sunun.",
        "KOBİ'ler için 'ESG Uyum Sertifikası' programını başlatarak kurumsal prestijlerini artırın."
      ],
      priorityRegion: "Bursa/Nilüfer",
      projectedImpact: "Belediye bakım bütçesinde yıllık %20 tasarruf ve site aidatlarında %10 düşüş öngörülüyor."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = `
    Sen HYDRA-AI B2B Strateji ve Kamu Politikası Danışmanısın.
    
    Hedef: Belediyeler ve Site Yönetimleri için operasyonel verimlilik.
    
    Veri: ${JSON.stringify(stats)}
    
    Görev:
    1. 'summary': B2B/B2G tarafındaki en büyük kazanımı veya entegrasyon fırsatını vurgula. (B2B2C modeli).
    2. 'actionItems': Belediyelerle veri paylaşımı ve altyapı iyileştirmesi için 3 somut öneri sun. (Yerel Güçlenme).
    3. 'projectedImpact': Kurumsal tasarruf veya ESG skoru üzerindeki etkiyi belirt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] },
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityRegion: { type: Type.STRING },
            projectedImpact: { type: Type.STRING }
          },
          required: ['riskLevel', 'summary', 'actionItems', 'priorityRegion', 'projectedImpact']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
     return {
      riskLevel: 'LOW',
      summary: "B2B analiz servisi şu an meşgul.",
      actionItems: ["Manuel rapor oluştur"],
      priorityRegion: "B2B",
      projectedImpact: "-"
    };
  }
};