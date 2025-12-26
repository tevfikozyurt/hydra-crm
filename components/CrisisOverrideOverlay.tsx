import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Droplets, Megaphone, Trophy, Activity, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface CrisisOverrideOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrisisOverrideOverlay: React.FC<CrisisOverrideOverlayProps> = ({ isOpen, onClose }) => {
  const [activeSimulation, setActiveSimulation] = useState(false);
  const [daysLeft, setDaysLeft] = useState(18);
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);

  const handleAction = (action: string) => {
    if (actionsTaken.includes(action)) return;
    
    setActionsTaken([...actionsTaken, action]);
    
    // Simulate Impact
    if (action === 'simulate') {
        setActiveSimulation(true);
        // Animate days increasing
        let current = 18;
        const target = 42;
        const interval = setInterval(() => {
            current += 1;
            setDaysLeft(current);
            if (current >= target) clearInterval(interval);
        }, 50);
    } else if (action === 'warning') {
        // Immediate visual feedback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* 1. Backdrop Layer - Red Alert Pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-950/90 backdrop-blur-xl"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent animate-pulse-fast" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </motion.div>

          {/* 2. Main Crisis Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-full max-w-4xl bg-black/40 border-2 border-red-500/50 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.4)] flex flex-col md:flex-row"
          >
            {/* Header Stripe */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-red-600 animate-[shimmer_2s_infinite]" />

            {/* LEFT: Context & Status */}
            <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-red-500/30 flex flex-col justify-between bg-gradient-to-b from-red-950/50 to-transparent">
                
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-600 rounded-lg animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                            <AlertTriangle className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-mono font-bold text-white tracking-widest leading-none">
                                BÖLGESEL KISITLAMA
                            </h2>
                            <p className="text-red-400 font-mono text-sm tracking-[0.2em] mt-1">PROTOKOL: KIRMIZI</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Critical Metric 1: Dam Level */}
                        <div>
                            <div className="flex justify-between text-sm font-mono text-red-200 mb-2">
                                <span>BARAJ SEVİYESİ</span>
                                <span className="font-bold text-red-500 animate-pulse">%10 (KRİTİK)</span>
                            </div>
                            <div className="w-full h-4 bg-red-950 rounded-full overflow-hidden border border-red-900">
                                <motion.div 
                                    initial={{ width: '40%' }}
                                    animate={{ width: '10%' }}
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" 
                                />
                            </div>
                        </div>

                        {/* Critical Metric 2: Target */}
                        <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                            <div className="flex items-center gap-3">
                                <Lock className="text-red-400" size={20} />
                                <div>
                                    <div className="text-xs text-red-300 font-mono uppercase">Zorunlu Hedef</div>
                                    <div className="text-lg font-bold text-white font-mono">Tüketimi %30 Azalt</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Storytelling - THE HOOK */}
                <div className="mt-8 pt-6 border-t border-red-500/30">
                     <p className="text-sm font-mono text-red-200 leading-relaxed">
                        <span className="text-red-500 mr-2">⚠</span>
                        Mevcut tüketim hızıyla devam edilirse, bölgedeki rezervlerin tükenme riski bulunmaktadır.
                     </p>
                     
                     <div className="mt-4 flex items-baseline gap-2">
                        <div className="text-xs text-gray-400 font-mono uppercase">TAHMİNİ TÜKENİŞ (SIFIR GÜNÜ):</div>
                        <motion.div 
                            key={daysLeft}
                            initial={{ scale: 1.5, color: '#ef4444' }}
                            animate={{ scale: 1, color: activeSimulation ? '#34d399' : '#ef4444' }}
                            className="text-4xl font-bold font-mono"
                        >
                            {daysLeft} GÜN
                        </motion.div>
                     </div>
                     {activeSimulation && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400 mt-1 font-mono">
                           +24 GÜN KAZANILDI (SİMÜLASYON)
                        </motion.div>
                     )}
                </div>

            </div>

            {/* RIGHT: Actions & Intervention */}
            <div className="md:w-1/2 p-8 flex flex-col gap-4 bg-black/20">
                <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity size={16} /> MÜDAHALE SEÇENEKLERİ
                </h3>

                {/* Action 1: Mass Warning */}
                <button 
                    onClick={() => handleAction('warning')}
                    disabled={actionsTaken.includes('warning')}
                    className={`group relative w-full p-4 rounded-xl border transition-all overflow-hidden flex items-center gap-4 ${
                        actionsTaken.includes('warning') 
                        ? 'bg-emerald-900/20 border-emerald-500/50 cursor-default' 
                        : 'bg-red-900/10 border-red-500/30 hover:bg-red-900/30 hover:border-red-500'
                    }`}
                >
                    <div className={`p-3 rounded-lg ${actionsTaken.includes('warning') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform'}`}>
                        {actionsTaken.includes('warning') ? <CheckCircle2 size={24}/> : <Megaphone size={24} />}
                    </div>
                    <div className="text-left flex-1">
                        <div className={`font-bold font-mono ${actionsTaken.includes('warning') ? 'text-emerald-400' : 'text-gray-200'}`}>
                            OTOMATİK KİTLESEL UYARI
                        </div>
                        <div className="text-xs text-gray-500">Tüm kullanıcılara acil tasarruf push bildirimi gönder.</div>
                    </div>
                </button>

                {/* Action 2: Gamification */}
                <button 
                    onClick={() => handleAction('gamification')}
                    disabled={actionsTaken.includes('gamification')}
                    className={`group relative w-full p-4 rounded-xl border transition-all overflow-hidden flex items-center gap-4 ${
                        actionsTaken.includes('gamification') 
                        ? 'bg-emerald-900/20 border-emerald-500/50 cursor-default' 
                        : 'bg-amber-900/10 border-amber-500/30 hover:bg-amber-900/30 hover:border-amber-500'
                    }`}
                >
                     <div className={`p-3 rounded-lg ${actionsTaken.includes('gamification') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform'}`}>
                         {actionsTaken.includes('gamification') ? <CheckCircle2 size={24}/> : <Trophy size={24} />}
                    </div>
                    <div className="text-left flex-1">
                        <div className={`font-bold font-mono ${actionsTaken.includes('gamification') ? 'text-emerald-400' : 'text-gray-200'}`}>
                            REKABETİ BAŞLAT
                        </div>
                        <div className="text-xs text-gray-500">"Kriz Kahramanı" rozeti ve tasarruf ligi aktivasyonu.</div>
                    </div>
                </button>

                {/* Action 3: Simulation */}
                <button 
                    onClick={() => handleAction('simulate')}
                    disabled={actionsTaken.includes('simulate')}
                    className={`group relative w-full p-4 rounded-xl border transition-all overflow-hidden flex items-center gap-4 ${
                        activeSimulation
                        ? 'bg-blue-900/20 border-blue-500/50 cursor-default' 
                        : 'bg-blue-900/10 border-blue-500/30 hover:bg-blue-900/30 hover:border-blue-500'
                    }`}
                >
                     <div className={`p-3 rounded-lg ${activeSimulation ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform'}`}>
                         {activeSimulation ? <Activity size={24}/> : <ArrowRight size={24} />}
                    </div>
                    <div className="text-left flex-1">
                        <div className={`font-bold font-mono ${activeSimulation ? 'text-blue-400' : 'text-gray-200'}`}>
                            KISITLAMA SİMÜLASYONU
                        </div>
                        <div className="text-xs text-gray-500">Mevcut rezerv ile dayanma süresini hesapla.</div>
                    </div>
                </button>

                <div className="mt-auto pt-4 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 bg-transparent border border-gray-600 text-gray-400 rounded-lg hover:bg-white/5 transition-colors font-mono text-xs">
                        İPTAL ET
                    </button>
                    <button onClick={onClose} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all font-mono font-bold text-xs tracking-wider">
                        PROTOKOLÜ UYGULA
                    </button>
                </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CrisisOverrideOverlay;