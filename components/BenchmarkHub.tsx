import React from 'react';
import { motion } from 'framer-motion';
import { BenchmarkStats } from '../types';
import { Scale, TrendingUp, TrendingDown, ArrowRight, ArrowUpRight, ArrowDownRight, Users, Zap, Map } from 'lucide-react';

interface BenchmarkHubProps {
  onAnalyze: () => void;
}

const BenchmarkHub: React.FC<BenchmarkHubProps> = ({ onAnalyze }) => {
  
  // Mock Data
  const stats: BenchmarkStats = {
    periodComparison: {
      current: 135,
      previous: 148,
      metric: "Ortalama Günlük Tüketim (L)",
      change: -8.8 // Negative is GOOD for consumption
    },
    cohortComparison: {
      hydraUserAvg: 135,
      regionAvg: 165,
      unit: "L/Kişi/Gün"
    },
    regionalComparison: {
      pilot: { name: "Bursa (Pilot)", score: 92, trend: 'up' }, // Efficiency Score
      expansion: { name: "İstanbul (Genişleme)", score: 76, trend: 'up' }
    },
    momentum: {
      score: 78, // High momentum
      direction: 'accelerating'
    }
  };

  const isPositiveChange = stats.periodComparison.change < 0; // Less consumption is positive
  const hydraPerformance = ((stats.cohortComparison.regionAvg - stats.cohortComparison.hydraUserAvg) / stats.cohortComparison.regionAvg) * 100;

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/30 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         
         <div className="z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
               <Scale className="text-blue-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-mono font-bold text-blue-400">
                  KONTRAST & İVME
               </h2>
               <p className="text-blue-200/60 font-mono text-sm mt-1 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" />
                  Tasarruf İvmesi: <span className="text-white font-bold">{stats.momentum.direction === 'accelerating' ? 'HIZLANIYOR' : 'YAVAŞLIYOR'}</span>
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        
        {/* COL 1: Period Comparison (This Month vs Last Month) */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between group hover:border-blue-500/30 transition-colors">
            <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> DÖNEMSEL KIYASLAMA
            </h3>

            {/* Chart Area - Fixed Height for stability */}
            <div className="flex items-end justify-center gap-8 h-64 pb-2 border-b border-white/5 mb-4">
                
                {/* Previous Period Bar Group */}
                <div className="flex flex-col items-center justify-end h-full gap-2 w-20">
                    <span className="text-sm font-bold text-gray-400 font-mono mb-1">
                        {stats.periodComparison.previous}L
                    </span>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '70%' }}
                        className="w-full bg-slate-700/50 rounded-t-lg border-t border-x border-white/5"
                    />
                    <div className="h-px w-full bg-white/10" />
                    <span className="text-xs font-mono text-gray-500 text-center mt-2">Geçen Ay</span>
                </div>

                {/* Current Period Bar Group */}
                <div className="flex flex-col items-center justify-end h-full gap-2 w-20">
                    <span className={`text-2xl font-bold font-mono mb-1 ${isPositiveChange ? 'text-cyan-400' : 'text-red-400'}`}>
                        {stats.periodComparison.current}L
                    </span>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: isPositiveChange ? '55%' : '85%' }} // Visual scale logic
                        className={`w-full rounded-t-lg relative shadow-[0_0_20px_rgba(0,0,0,0.3)] ${isPositiveChange ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' : 'bg-gradient-to-t from-red-600 to-red-400'}`}
                    />
                    <div className={`h-1 w-full rounded-full ${isPositiveChange ? 'bg-cyan-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-mono text-white font-bold text-center mt-2">Bu Ay</span>
                </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-center gap-3 ${isPositiveChange ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-red-950/30 border-red-500/30'}`}>
                {isPositiveChange ? <ArrowDownRight className="text-cyan-400" size={24} /> : <ArrowUpRight className="text-red-400" size={24} />}
                <div>
                    <div className={`text-lg font-bold font-mono ${isPositiveChange ? 'text-cyan-400' : 'text-red-400'}`}>
                        {Math.abs(stats.periodComparison.change)}% {isPositiveChange ? 'AZALIŞ' : 'ARTIŞ'}
                    </div>
                    <div className="text-[10px] text-gray-400">Ortalama tüketim trendi</div>
                </div>
            </div>
        </div>

        {/* COL 2: Cohort Comparison (Hydra vs Region) */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col gap-6">
            <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider flex items-center gap-2">
                <Users size={14} /> KULLANICI SEGMENT KIYASI
            </h3>

            <div className="flex flex-col gap-6">
                {/* Region Avg */}
                <div className="relative group">
                    <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                        <span>Bölge Ortalaması</span>
                        <span>{stats.cohortComparison.regionAvg} L</span>
                    </div>
                    <div className="w-full h-12 bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] flex items-center px-4">
                           <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Standart Tüketim</span>
                        </div>
                    </div>
                </div>

                {/* Hydra User */}
                <div className="relative group">
                    <div className="flex justify-between text-xs font-mono text-cyan-400 mb-2 font-bold">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/> Hydra Kullanıcısı</span>
                        <span>{stats.cohortComparison.hydraUserAvg} L</span>
                    </div>
                    <div className="w-full h-12 bg-slate-800/50 rounded-lg overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(stats.cohortComparison.hydraUserAvg / stats.cohortComparison.regionAvg) * 100}%` }}
                           transition={{ duration: 1.5 }}
                           className="h-full bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-400 flex items-center justify-end px-3 relative"
                        >
                           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                           <span className="text-[10px] text-black font-bold font-mono z-10">VERİMLİ</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Insight Text - UPDATED STORY */}
            <div className="flex-1 flex items-end">
                 <div className="p-3 bg-blue-950/20 border-l-2 border-blue-500 rounded-r">
                    <p className="text-xs text-gray-300 leading-relaxed font-mono">
                        "Hydra kullanıcıları bu ay Bölge Ortalamasına göre <span className="text-cyan-400 font-bold text-sm">%{hydraPerformance.toFixed(1)}</span> daha az su tüketmiştir. Bu başarının ana kaynakları; <span className="text-white font-bold">(1) AI destekli sızıntı tespiti</span> ve <span className="text-white font-bold">(2) Oyunlaştırma ile hızlanan davranış değişikliğidir.</span>"
                    </p>
                 </div>
            </div>
        </div>

        {/* COL 3: Regional & Action */}
        <div className="flex flex-col gap-6">
            
            {/* Regional Map List */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex-1">
                <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                    <Map size={14} /> PİLOT vs GENİŞLEME
                </h3>
                
                <div className="space-y-4">
                    {/* Pilot Region */}
                    <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg group hover:bg-emerald-900/20 transition-colors">
                        <div>
                            <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                                {stats.regionalComparison.pilot.name}
                                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/30">LİDER</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">Olgunluk Seviyesi: Yüksek</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.regionalComparison.pilot.score}</div>
                            <div className="text-[9px] text-emerald-600/70 font-bold">SKOR</div>
                        </div>
                    </div>

                    {/* Expansion Region */}
                    <div className="flex items-center justify-between p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg group hover:bg-amber-900/20 transition-colors">
                        <div>
                            <div className="text-sm font-bold text-white font-mono">{stats.regionalComparison.expansion.name}</div>
                            <div className="text-[10px] text-gray-400 mt-1">Olgunluk Seviyesi: Orta</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400 font-mono">{stats.regionalComparison.expansion.score}</div>
                            <div className="text-[9px] text-amber-600/70 font-bold">SKOR</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Action Button */}
           <button 
              onClick={onAnalyze}
              className="w-full py-6 bg-blue-900/50 hover:bg-blue-800/50 text-white rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center gap-3 group border border-blue-500/50 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300 text-blue-300" />
              <div className="text-left z-10">
                 <div className="font-mono font-bold text-sm tracking-widest text-blue-100">PROAKTİF MÜDAHALE</div>
                 <div className="text-[10px] text-blue-300/70">Fark Kapanıyor: Push Bildirimi Gönder</div>
              </div>
           </button>

        </div>

      </div>
    </div>
  );
};

export default BenchmarkHub;