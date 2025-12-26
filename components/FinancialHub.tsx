import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Landmark, PieChart, ArrowUpRight, ShieldCheck, Briefcase } from 'lucide-react';
import { FinancialStats } from '../types';

interface FinancialHubProps {
  onAnalyze: () => void;
}

const FinancialHub: React.FC<FinancialHubProps> = ({ onAnalyze }) => {
  
  // Mock Data
  const stats: FinancialStats = {
    savedAmount: 845290, // TL
    preventedWasteVol: 42500, // m3
    tcoData: {
      hydraCost: 650, // Retrofit cost
      competitorCost: 2200 // Smart Meter replacement
    },
    revenueStream: {
      hardware: 55,
      saas: 30,
      api: 15
    },
    roiMonths: 4.2
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-500/30 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         
         <div className="z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/50">
               <Landmark className="text-amber-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-mono font-bold text-amber-400">
                  FİNANSAL ETKİ & BÜYÜME
               </h2>
               <p className="text-amber-200/60 font-mono text-sm mt-1 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Yatırımın Geri Dönüşü (ROI): <span className="text-white font-bold">{stats.roiMonths} Ay</span>
               </p>
            </div>
         </div>

         <div className="hidden md:flex items-center gap-6 z-10">
            <div className="text-right">
               <div className="text-xs text-amber-500/70 font-bold uppercase tracking-widest">TOPLAM TASARRUF (YTD)</div>
               <div className="text-3xl font-bold text-white font-mono flex items-center justify-end gap-1">
                  ₺{stats.savedAmount.toLocaleString()}
                  <ArrowUpRight size={20} className="text-emerald-500" />
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* COL 1: Impact & Savings */}
        <div className="space-y-6">
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Coins size={100} className="text-emerald-500" />
              </div>
              
              <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider">SIZDINTIDAN KORUNAN FATURA</h3>
              <div className="text-4xl font-bold text-emerald-400 font-mono">
                 ₺{(stats.savedAmount / 1000).toFixed(1)}K
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-emerald-500"
                 />
              </div>
              <p className="text-xs text-gray-400 font-mono">
                 Engellenen Atık Su: <span className="text-white">{stats.preventedWasteVol.toLocaleString()} m³</span>
              </p>
           </div>

           <div className="bg-amber-950/20 border-l-2 border-amber-500 p-4 rounded-r-lg">
              <p className="text-xs text-amber-100/80 leading-relaxed font-mono">
                 Bu ay tespit edilen sızıntılar, kullanıcılarımızın toplamda <span className="text-white font-bold">₺{(stats.savedAmount / 30).toLocaleString()}</span> ek fatura ödemesini engellemiştir. 
                 Bu, sistemin kendini <span className="text-emerald-400 font-bold">{stats.roiMonths} ayda</span> amorti ettiğini gösterir.
              </p>
           </div>
        </div>

        {/* COL 2: TCO Comparison (Bar Chart) */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider flex items-center gap-2">
                 <TrendingUp size={14} /> TCO KARŞILAŞTIRMASI (Cihaz Başı)
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-2 py-1 rounded">
                 %{(100 - (stats.tcoData.hydraCost / stats.tcoData.competitorCost * 100)).toFixed(0)} CapEx Avantajı
              </span>
           </div>

           <div className="flex-1 flex items-end justify-center gap-12 px-4 relative">
              
              {/* Competitor Bar */}
              <div className="w-24 flex flex-col items-center gap-2 group">
                 <div className="text-xs text-red-400 font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity">₺{stats.tcoData.competitorCost}</div>
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '200px' }}
                    transition={{ duration: 1 }}
                    className="w-full bg-slate-700 rounded-t-lg relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-white/50 font-mono -rotate-90 whitespace-nowrap origin-center mt-8">
                       Standart Sayaç
                    </div>
                 </motion.div>
                 <span className="text-[10px] text-gray-500 font-mono uppercase">Geleneksel</span>
              </div>

              {/* Hydra Bar */}
              <div className="w-24 flex flex-col items-center gap-2 group">
                 <div className="text-xs text-emerald-400 font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity">₺{stats.tcoData.hydraCost}</div>
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(stats.tcoData.hydraCost / stats.tcoData.competitorCost) * 200}px` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg relative shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                 >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-black/60 font-bold font-mono whitespace-nowrap">
                       HYDRA
                    </div>
                 </motion.div>
                 <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Retrofit</span>
              </div>
              
              {/* Cost Gap Line */}
              <div className="absolute top-[20px] left-[50%] ml-8 text-[10px] text-gray-500 border-l border-dashed border-gray-600 h-[150px] pl-2 flex items-center">
                 Maliyet Farkı
              </div>
           </div>
        </div>

        {/* COL 3: Revenue & Strategy */}
        <div className="flex flex-col gap-6">
           
           {/* Revenue Mix */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex-1">
              <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                 <PieChart size={14} /> GELİR AKIŞI DAĞILIMI
              </h3>
              
              <div className="flex items-center gap-6">
                 {/* CSS/SVG Donut */}
                 <div className="relative w-32 h-32 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                       {/* Hardware */}
                       <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" 
                          strokeDasharray={`${stats.revenueStream.hardware}, 100`} />
                       {/* SaaS */}
                       <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" 
                          strokeDasharray={`${stats.revenueStream.saas}, 100`} strokeDashoffset={`-${stats.revenueStream.hardware}`} />
                       {/* API */}
                       <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" 
                          strokeDasharray={`${stats.revenueStream.api}, 100`} strokeDashoffset={`-${stats.revenueStream.hardware + stats.revenueStream.saas}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-xs font-bold text-white font-mono">HIBIRT</span>
                       <span className="text-[8px] text-gray-500">MODEL</span>
                    </div>
                 </div>

                 <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/> Donanım</span>
                       <span className="text-white font-bold">%{stats.revenueStream.hardware}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> SaaS</span>
                       <span className="text-white font-bold">%{stats.revenueStream.saas}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> API</span>
                       <span className="text-white font-bold">%{stats.revenueStream.api}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Action Button */}
           <button 
              onClick={onAnalyze}
              className="w-full py-6 bg-amber-900/50 hover:bg-amber-800/50 text-white rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all flex items-center justify-center gap-3 group border border-amber-500/50 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <Briefcase size={24} className="group-hover:scale-110 transition-transform duration-300 text-amber-300" />
              <div className="text-left z-10">
                 <div className="font-mono font-bold text-sm tracking-widest text-amber-100">GELİR OPTİMİZASYONU</div>
                 <div className="text-[10px] text-amber-300/70">AI Destekli SaaS Dönüşümü</div>
              </div>
           </button>
        </div>

      </div>
    </div>
  );
};

export default FinancialHub;