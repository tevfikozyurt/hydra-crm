import React, { useState, useEffect, useMemo } from 'react';
import { KPI, TimeFilter, Anomaly, AIAnalysisResult, ImpactStory, ViewMode, GamificationStats, TechStats, FinancialStats, BenchmarkStats, SimulationParams, SimulationStats, B2BStats } from './types';
import KPICard from './components/KPICard';
import BackgroundMap from './components/BackgroundMap';
import Ticker from './components/Ticker';
import AIModal from './components/AIModal';
import ZeroLeakageSection from './components/ZeroLeakageSection';
import WaterLegacySection from './components/WaterLegacySection';
import BehaviorLab from './components/BehaviorLab'; 
import TechBackbone from './components/TechBackbone'; 
import FinancialHub from './components/FinancialHub'; 
import BenchmarkHub from './components/BenchmarkHub'; 
import SimulatorHub from './components/SimulatorHub'; 
import B2BHub from './components/B2BHub'; 
import CrisisOverrideOverlay from './components/CrisisOverrideOverlay'; 
import CustomDatePickerModal from './components/CustomDatePickerModal';
import { analyzeSystemStatus, analyzeAnomalyPriority, analyzeGamificationStrategy, analyzeInfrastructureOptimization, analyzeFinancialStrategy, analyzeBenchmarkStrategy, analyzeSimulationScenario, analyzeB2BImpact } from './services/geminiService';
import { Activity, Droplets, Users, BrainCircuit, Calendar, Waves, Home, AlertCircle, LayoutDashboard, FlaskConical, Network, Landmark, Scale, Calculator, Building2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('COMMAND');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1H');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false); 
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Custom Date Range State
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string} | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // State for dynamic data
  const [currentKpis, setCurrentKpis] = useState<KPI[]>([]);
  const [impactStory, setImpactStory] = useState<ImpactStory | null>(null);

  // Mock Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- FARKINDALIK MOTORU (AWARENESS ENGINE) & DATA SIMULATION ---
  useEffect(() => {
    // 1. Çarpanları Belirle (Simülasyon)
    let multiplier = 1;
    let periodLabel = "Son 1 Saatte";
    let isCustomPeriod = false;
    
    switch (timeFilter) {
      case '1H': multiplier = 1; periodLabel = "Son 1 Saatte"; break;
      case '24H': multiplier = 24; periodLabel = "Son 24 Saatte"; break;
      case '7D': multiplier = 24 * 7; periodLabel = "Son 7 Günde"; break;
      case '30D': multiplier = 24 * 30; periodLabel = "Son 30 Günde"; break;
      case 'Custom': 
        if (customDateRange) {
           // Calculate days difference roughly
           const start = new Date(customDateRange.start);
           const end = new Date(customDateRange.end);
           const diffTime = Math.abs(end.getTime() - start.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
           multiplier = 24 * diffDays;
           periodLabel = "Seçili Dönemde";
           isCustomPeriod = true;
        } else {
           multiplier = 12; // Default fallback
           periodLabel = "Özel Aralıkta";
        }
        break;
    }

    // 2. KPI'ları Hesapla
    const baseLeakRate = 12.4; // L/dk
    const totalLeak = Math.floor(baseLeakRate * 60 * multiplier); // Toplam Litre
    const detectedLeaks = Math.floor(3 * multiplier * 0.8); // Zamanla artan tespit sayısı

    const newKpis: KPI[] = [
      {
        id: 'leak-rate',
        label: timeFilter === '1H' ? 'Anlık Sızıntı Oranı' : 'Toplam Su Kaybı',
        value: timeFilter === '1H' ? baseLeakRate : (totalLeak / 1000).toFixed(1), // Tonaj gösterimi
        unit: timeFilter === '1H' ? 'L/dk' : 'TON',
        trend: 'up',
        trendValue: '+2.4%',
        status: 'critical',
        description: 'Adana & Konya şebekelerinde kritik basınç düşüşü.',
      },
      {
        id: 'behavior-score',
        label: 'Davranış Değişikliği Puanı',
        value: 78,
        unit: 'Puan',
        trend: 'up',
        trendValue: '+5.1%',
        status: 'normal',
        description: 'Oyunlaştırma modülü katılımı %15 arttı.',
      },
      {
        id: 'detected-leaks',
        label: 'Tespit Edilen Kaçak (AI)',
        value: detectedLeaks,
        unit: 'Adet',
        trend: 'stable',
        trendValue: '0%',
        status: 'warning',
        description: 'Akustik sensörler yeni anomaliler doğruladı.',
      },
      {
        id: 'consumption',
        label: 'Ortalama Tüketim',
        value: isCustomPeriod ? 152 : 142, // Simulate rise for custom story
        unit: 'L/Gün',
        trend: isCustomPeriod ? 'up' : 'down',
        trendValue: isCustomPeriod ? '+7.5%' : '-1.2%',
        status: isCustomPeriod ? 'warning' : 'normal',
        description: isCustomPeriod ? 'Mevsimsel etki nedeniyle artış.' : 'Küresel ortalamanın (150L) altında.',
      },
    ];

    setCurrentKpis(newKpis);

    // 3. FARKINDALIK HİKAYESİ (Data Storytelling)
    let story: ImpactStory;
    
    // CUSTOM STORY LOGIC (OVERRIDE)
    if (isCustomPeriod && customDateRange) {
        // Format dates nicely
        const formatDate = (d: string) => {
            const date = new Date(d);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        };
        
        story = {
            title: "ÖZEL DÖNEM ANALİZİ",
            message: `Bu özel dönem (${formatDate(customDateRange.start)} - ${formatDate(customDateRange.end)}) zarfında, AI'ın sızıntı tespit ivmesi en yüksek seviyeye ulaşmış, ancak ortalama günlük tüketim %7.5 artış göstererek dikkat çekmektedir.`,
            concreteValue: "AI TESPİT REKORU",
            icon: 'pool',
            highlightColor: 'text-cyan-400'
        };
    } else {
        // STANDARD LOGIC
        if (totalLeak > 2500000) {
            const pools = (totalLeak / 2500000).toFixed(1);
            story = {
                title: "KRİTİK KAYIP HACMİ",
                message: `${periodLabel} ulusal şebekede kaybedilen su miktarı, tam dolu olimpik yüzme havuzuna eşdeğer.`,
                concreteValue: `${pools} OLİMPİK HAVUZ`,
                icon: 'pool',
                highlightColor: 'text-hydra-alert'
            };
        } else if (totalLeak > 5000) {
            const houses = Math.floor(totalLeak / 500);
            story = {
                title: "HANE HALKI ETKİSİ",
                message: `${periodLabel} boşa akan su ile orta ölçekli bir ilçenin günlük su ihtiyacı karşılanabilirdi.`,
                concreteValue: `${houses} HANENİN GÜNLÜK SUYU`,
                icon: 'house',
                highlightColor: 'text-hydra-warn'
            };
        } else {
            // DRINKING WATER STORY (Revized for Concrete Impact)
            const bottles = Math.floor(totalLeak / 19);
            story = {
                title: "İÇME SUYU EŞDEĞERİ",
                message: `${periodLabel} oluşan sızıntı, yaklaşık ${bottles} DAMACANA İÇME SUYUNA denk geliyor.`,
                concreteValue: `${bottles} DAMACANA`,
                icon: 'bottle',
                highlightColor: 'text-hydra-cyan'
            };
        }
    }
    setImpactStory(story);

  }, [timeFilter, customDateRange]);

  // Updated Anomalies with Risk Scores and Color Logic
  const anomalies: Anomaly[] = [
    { id: 'a1', location: 'ADANA/SEYHAN', severity: 'high', type: 'BORU PATLAMASI', timestamp: '10:42', value: 'Kayıp: 45L/dk', riskScore: 9 },
    { id: 'a2', location: 'İSTANBUL/ESENYURT', severity: 'medium', type: 'TÜKETİM SIÇRAMASI', timestamp: '10:38', value: '+40% Var', riskScore: 6 },
    { id: 'a3', location: 'İZMİR/BUCA', severity: 'low', type: 'SENSÖR HATASI', timestamp: '09:55', value: 'Sinyal Yok', riskScore: 3 },
    { id: 'a4', location: 'KONYA/MERAM', severity: 'high', type: 'BASINÇ KAYBI', timestamp: '10:40', value: '-2.4 Bar', riskScore: 8 },
  ];

  // Main AI Analysis
  const handleAIAction = async () => {
    setIsAIModalOpen(true);
    setAiLoading(true);
    try {
      const result = await analyzeSystemStatus(currentKpis, anomalies, timeFilter);
      setAiData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Specific Anomaly Priority Analysis
  const handleAnomalyPriority = async () => {
     setIsAIModalOpen(true);
     setAiLoading(true);
     try {
       const result = await analyzeAnomalyPriority(timeFilter);
       setAiData(result);
     } catch(e) {
        console.error(e);
     } finally {
        setAiLoading(false);
     }
  }

  // Gamification Analysis
  const handleGamificationAnalysis = async () => {
     setIsAIModalOpen(true);
     setAiLoading(true);
     try {
       const mockStats: GamificationStats = {
        totalBadges: 1420,
        leaderboardRank: 14,
        avgScoreTrend: [65, 68, 72, 70, 75, 78, 82, 85, 84, 88],
        impactTrees: 340,
        impactAnimals: 1250,
        aiAdoptionRate: 42,
        aiSavingsDelta: 22
       };
       const result = await analyzeGamificationStrategy(mockStats);
       setAiData(result);
     } catch(e) {
        console.error(e);
     } finally {
        setAiLoading(false);
     }
  }

  // Tech Infrastructure Analysis
  const handleTechAnalysis = async () => {
     setIsAIModalOpen(true);
     setAiLoading(true);
     try {
       const mockTechStats: TechStats = {
        totalDevices: 12450,
        deviceHealth: { active: 11200, lowBattery: 850, offline: 400 },
        signalQuality: [
          { region: 'İstanbul', rssi: -95, status: 'good', coverage: 98 },
          { region: 'Ankara', rssi: -115, status: 'fair', coverage: 85 },
          { region: 'Adana', rssi: -128, status: 'poor', coverage: 72 },
        ],
        avgBatteryLifeYears: 8.4
       };
       const result = await analyzeInfrastructureOptimization(mockTechStats);
       setAiData(result);
     } catch(e) {
        console.error(e);
     } finally {
        setAiLoading(false);
     }
  }

  // Financial Analysis
  const handleFinancialAnalysis = async () => {
     setIsAIModalOpen(true);
     setAiLoading(true);
     try {
       const mockFinStats: FinancialStats = {
        savedAmount: 845290, 
        preventedWasteVol: 42500,
        tcoData: { hydraCost: 650, competitorCost: 2200 },
        revenueStream: { hardware: 55, saas: 30, api: 15 },
        roiMonths: 4.2
       };
       const result = await analyzeFinancialStrategy(mockFinStats);
       setAiData(result);
     } catch(e) {
        console.error(e);
     } finally {
        setAiLoading(false);
     }
  }

  // Benchmark Analysis
  const handleBenchmarkAnalysis = async () => {
     setIsAIModalOpen(true);
     setAiLoading(true);
     try {
       const mockBenchStats: BenchmarkStats = {
         periodComparison: { current: 135, previous: 148, metric: "Ortalama Günlük Tüketim (L)", change: -8.8 },
         cohortComparison: { hydraUserAvg: 135, regionAvg: 165, unit: "L/Kişi/Gün" },
         regionalComparison: {
            pilot: { name: "Bursa (Pilot)", score: 92, trend: 'up' },
            expansion: { name: "İstanbul (Genişleme)", score: 76, trend: 'up' }
         },
         momentum: { score: 78, direction: 'accelerating' }
       };
       const result = await analyzeBenchmarkStrategy(mockBenchStats);
       setAiData(result);
     } catch(e) {
        console.error(e);
     } finally {
        setAiLoading(false);
     }
  }

  // Simulation Analysis
  const handleSimulationAnalysis = async (params: SimulationParams, stats: SimulationStats) => {
    setIsAIModalOpen(true);
    setAiLoading(true);
    try {
      const result = await analyzeSimulationScenario(params, stats);
      setAiData(result);
    } catch(e) {
       console.error(e);
    } finally {
       setAiLoading(false);
    }
 }

 // B2B Analysis
 const handleB2BAnalysis = async (stats: B2BStats) => {
    setIsAIModalOpen(true);
    setAiLoading(true);
    try {
      const result = await analyzeB2BImpact(stats);
      setAiData(result);
    } catch(e) {
       console.error(e);
    } finally {
       setAiLoading(false);
    }
 }

  const timeOptions: { value: TimeFilter; label: string }[] = [
    { value: '1H', label: '1S' },
    { value: '24H', label: '24S' },
    { value: '7D', label: '7G' },
    { value: '30D', label: '30G' },
    { value: 'Custom', label: 'ÖZEL' },
  ];

  // Helper to display date label
  const getCustomLabel = () => {
    if (customDateRange) {
        const s = new Date(customDateRange.start);
        const e = new Date(customDateRange.end);
        return `${s.getDate()} ${s.toLocaleString('tr-TR', {month:'short'}).toUpperCase()} - ${e.getDate()} ${e.toLocaleString('tr-TR', {month:'short'}).toUpperCase()}`;
    }
    return 'ÖZEL';
  };

  const handleTimeFilterClick = (val: TimeFilter) => {
    if (val === 'Custom') {
        setIsDatePickerOpen(true);
    } else {
        setTimeFilter(val);
        setCustomDateRange(null); // Reset custom range if switching back to preset
    }
  };

  const handleCustomDateConfirm = (start: string, end: string) => {
      setCustomDateRange({ start, end });
      setTimeFilter('Custom');
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Background Layer (Only visible in Command Mode for focus) */}
      <div className={`transition-opacity duration-1000 ${viewMode === 'COMMAND' ? 'opacity-100' : 'opacity-20'}`}>
         <BackgroundMap onRegionSelect={(reg) => console.log(reg)} activeFilter={timeFilter} />
      </div>
      
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 animate-scanline opacity-5 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-20 w-full" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto w-full">
        
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-6">
          {/* Logo & View Switcher */}
          <div className="flex items-center gap-6 shrink-0 flex-wrap">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-cyan-500/50 rounded-lg flex items-center justify-center bg-cyan-950/30 backdrop-blur shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Droplets className="text-cyan-400" size={28} />
                </div>
                <div>
                <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                    HYDRA <span className="text-cyan-500 text-sm border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-widest bg-cyan-950/20">KOMUTA MERKEZİ</span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-cyan-300/70 font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    SİSTEM ÇEVRİMİÇİ
                    <span className="mx-2">|</span>
                    {currentTime.toLocaleTimeString('tr-TR')}
                </div>
                <button 
                   onClick={() => setIsCrisisModalOpen(true)}
                   className="mt-2 bg-red-950/80 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                   <ShieldAlert size={14} />
                   ACİL DURUM
                </button>
                </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                <button 
                   onClick={() => setViewMode('COMMAND')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'COMMAND' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <LayoutDashboard size={14} /> <span className="hidden sm:inline">ANA EKRAN</span>
                </button>
                <button 
                   onClick={() => setViewMode('LAB')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'LAB' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <FlaskConical size={14} /> <span className="hidden sm:inline">DAVRANIŞ LAB</span>
                </button>
                <button 
                   onClick={() => setViewMode('TECH')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'TECH' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <Network size={14} /> <span className="hidden sm:inline">TEKNİK AĞ</span>
                </button>
                <button 
                   onClick={() => setViewMode('FINANCE')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'FINANCE' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <Landmark size={14} /> <span className="hidden sm:inline">FİNANS</span>
                </button>
                <button 
                   onClick={() => setViewMode('BENCHMARK')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'BENCHMARK' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <Scale size={14} /> <span className="hidden sm:inline">KIYASLAMA</span>
                </button>
                <button 
                   onClick={() => setViewMode('SIMULATOR')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'SIMULATOR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <Calculator size={14} /> <span className="hidden sm:inline">SİMÜLATÖR</span>
                </button>
                <button 
                   onClick={() => setViewMode('B2B')}
                   className={`px-3 py-2 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all whitespace-nowrap ${viewMode === 'B2B' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
                >
                   <Building2 size={14} /> <span className="hidden sm:inline">KURUMSAL</span>
                </button>
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex items-center gap-4 flex-wrap w-full xl:w-auto">
             <div className={`shrink-0 flex flex-wrap bg-slate-950/80 backdrop-blur-xl rounded-lg p-1 border border-cyan-900/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${viewMode !== 'COMMAND' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                {timeOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleTimeFilterClick(option.value)}
                    className={`relative px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-all font-mono tracking-wide overflow-hidden whitespace-nowrap ${
                    timeFilter === option.value
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                >
                    {timeFilter === option.value && (
                        <motion.div 
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md z-0"
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                        {option.value === 'Custom' && <Calendar size={12} />}
                        {option.value === 'Custom' && customDateRange ? getCustomLabel() : option.label}
                    </span>
                </button>
                ))}
             </div>
          </div>
        </header>

        {/* --- VIEW CONTENT SWITCHER --- */}
        <AnimatePresence mode="wait">
        {viewMode === 'COMMAND' ? (
            /* EXISTING DASHBOARD GRID */
            <motion.main 
                key="command"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 relative"
            >
              {/* Left Column: Stats & Map Overlay */}
              <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-end pb-20 relative">
                 
                 <div className="absolute top-0 left-0 pointer-events-none p-4 opacity-50">
                    <p className="font-mono text-[10px] text-cyan-300 uppercase tracking-[0.2em] animate-pulse">
                        :: Canlı Şebeke Topolojisi ::
                    </p>
                 </div>

                 {/* Center Map Area */}
                 <div className="flex-1 min-h-[200px] pointer-events-none" /> 
                 
                 {/* ZERO LEAKAGE SECTION (Passing current impact story context indirectly via timeFilter updates logic inside) */}
                 <div className="mb-4 z-20 pointer-events-auto">
                    <ZeroLeakageSection timeFilter={timeFilter} onAnalyze={handleAnomalyPriority} customStoryOverride={impactStory} />
                 </div>

                 {/* WATER LEGACY SECTION */}
                 <div className="mb-4 z-20 pointer-events-auto">
                    <WaterLegacySection />
                 </div>

                 {/* KPI Cards Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnimatePresence mode='popLayout'>
                        {currentKpis.map((kpi, idx) => (
                        <KPICard key={`${kpi.id}-${timeFilter}`} data={kpi} delay={idx * 0.05} />
                        ))}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Right Column: Actions & Feed */}
              <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4 h-full pointer-events-auto">
                 
                 {/* General AI Action Button */}
                 <button
                    onClick={handleAIAction}
                    className="group relative w-full h-32 bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl rounded-xl overflow-hidden hover:border-cyan-400 transition-all flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent group-hover:from-cyan-500/20 transition-all duration-500" />
                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform duration-300">
                       <BrainCircuit className="text-white" size={24} />
                    </div>
                    <span className="font-mono font-bold text-lg text-white z-10 tracking-widest group-hover:text-cyan-100 transition-colors">AI RAPORU</span>
                    <span className="text-[10px] text-cyan-300 font-mono z-10 uppercase opacity-70">Genel Sistem Durumu</span>
                    
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />
                 </button>

                 {/* Live Feed Panel */}
                 <div className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 overflow-hidden flex flex-col min-h-[300px]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                       <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                            <Activity size={14} /> Canlı Telemetri
                       </div>
                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                       {[...Array(8)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between text-xs font-mono group hover:bg-white/5 p-2 rounded transition-colors cursor-default border-l-2 border-transparent hover:border-cyan-500/50">
                             <div className="flex items-center gap-2">
                                <span className="text-slate-500">#{8492 + i}</span>
                                <span className="text-slate-300">Sensör_Düğümü</span>
                             </div>
                             <span className="text-cyan-500/70 font-bold">{Math.floor(Math.random() * 50 + 20)}ms</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* System Status Mini-Panel */}
                 <div className="h-24 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                    <div>
                       <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Şebeke Kararlılığı</div>
                       <div className="text-xl font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">98.4%</div>
                    </div>
                    <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <div className="text-right">
                       <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Aktif Ajanlar</div>
                       <div className="text-xl font-bold text-white font-mono flex items-center justify-end gap-2">
                          14 <Users size={16} className="text-cyan-500 group-hover:scale-110 transition-transform" /> 
                       </div>
                    </div>
                 </div>

              </div>
            </motion.main>
        ) : viewMode === 'LAB' ? (
            /* BEHAVIOR LAB VIEW */
            <motion.main
                key="lab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <BehaviorLab onAnalyze={handleGamificationAnalysis} />
            </motion.main>
        ) : viewMode === 'TECH' ? (
             /* TECH BACKBONE VIEW */
             <motion.main
                key="tech"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <TechBackbone onAnalyze={handleTechAnalysis} />
            </motion.main>
        ) : viewMode === 'FINANCE' ? (
            /* FINANCIAL HUB VIEW */
            <motion.main
                key="finance"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <FinancialHub onAnalyze={handleFinancialAnalysis} />
            </motion.main>
        ) : viewMode === 'BENCHMARK' ? (
             /* BENCHMARK HUB VIEW */
            <motion.main
                key="benchmark"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <BenchmarkHub onAnalyze={handleBenchmarkAnalysis} />
            </motion.main>
        ) : viewMode === 'SIMULATOR' ? (
            /* SIMULATOR HUB VIEW */
            <motion.main
                key="simulator"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <SimulatorHub onAnalyze={handleSimulationAnalysis} />
            </motion.main>
        ) : (
            /* B2B HUB VIEW */
            <motion.main
                key="b2b"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col pb-20"
            >
                <B2BHub onAnalyze={handleB2BAnalysis} />
            </motion.main>
        )}
        </AnimatePresence>

        {/* Footer Ticker */}
        <div className="fixed bottom-0 left-0 w-full z-40">
           <Ticker anomalies={anomalies} />
        </div>

      </div>

      {/* MODALS */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        data={aiData}
        loading={aiLoading}
      />

      <CrisisOverrideOverlay 
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      <CustomDatePickerModal 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={handleCustomDateConfirm}
      />
      
    </div>
  );
};

export default App;