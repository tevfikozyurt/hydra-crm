import React from 'react';
import { motion } from 'framer-motion';
import { B2BStats } from '../types';
import { Building2, Handshake, ShieldCheck, TrendingUp, MapPin, BarChart3, PieChart, Users, ArrowUpRight, Zap } from 'lucide-react';

interface B2BHubProps {
  onAnalyze: (stats: B2BStats) => void;
}

const B2BHub: React.FC<B2BHubProps> = ({ onAnalyze }) => {
  
  // Mock Data
  const stats: B2BStats = {
    roiStats: {
      commonAreaSavings: 1250000,
      householdSavings: 850000,
      maintenanceCostReduction: 15
    },
    penetration: [
      { region: 'Bursa', type: 'Municipality', phase: 3, status: 'Active' },
      { region: 'İstanbul', type: 'SiteManagement', phase: 2, status: 'Active' },
      { region: 'İzmir', type: 'Municipality', phase: 1, status: 'Pending' },
      { region: 'Antalya', type: 'SiteManagement', phase: 2, status: 'Active' },
    ],
    esgScore: {
      water: 92,
      carbon: 85,
      social: 78,
      governance: 88,
      efficiency: 90
    }
  };

  const totalSavings = stats.roiStats.commonAreaSavings + stats.roiStats.householdSavings;
  const commonPct = (stats.roiStats.commonAreaSavings / totalSavings) * 100;

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/30 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         
         <div className="z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center border border-teal-500/50">
               <Handshake className="text-teal-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-mono font-bold text-teal-400">
                  ULUSAL BAĞLILIK & ETKİ
               </h2>
               <p className="text-teal-200/60 font-mono text-sm mt-1 flex items-center gap-2">
                  <Building2 size={14} className="text-white" />
                  Kurumsal Çözüm Ortaklığı: <span className="text-white font-bold">B2B2C ODAKLI</span>
               </p>
            </div>
         </div>

         <div className="hidden md:flex items-center gap-6 z-10">
             <div className="text-right">
                <div className="text-xs text-teal-500/70 font-bold uppercase tracking-widest">TOPLAM KURUMSAL ETKİ</div>
                <div className="text-2xl font-bold text-white font-mono">₺{(totalSavings/1000000).toFixed(1)}M</div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* COL 1: ROI Analysis (Common vs Household) */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between group hover:border-teal-500/30 transition-colors">
            <div>
               <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-6 flex items-center gap-2">
                  <BarChart3 size={14} /> ROI ANALİZİ: ORTAK ALAN vs HANE
               </h3>
               
               <div className="flex items-end justify-center gap-8 h-48 relative px-4">
                  {/* Household Bar */}
                  <div className="w-20 flex flex-col items-center gap-2 group/bar">
                      <div className="text-xs text-gray-400 font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity">
                         ₺{(stats.roiStats.householdSavings/1000).toFixed(0)}K
                      </div>
                      <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: '120px' }}
                         className="w-full bg-slate-700/50 rounded-t-lg relative border-t border-x border-white/5 group-hover/bar:bg-slate-700 transition-colors"
                      >
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono -rotate-90 origin-bottom mb-4">
                            Hanehalkı
                         </div>
                      </motion.div>
                  </div>

                  {/* Common Area Bar */}
                  <div className="w-20 flex flex-col items-center gap-2 group/bar">
                      <div className="text-xs text-teal-400 font-mono font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                         ₺{(stats.roiStats.commonAreaSavings/1000).toFixed(0)}K
                      </div>
                      <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: '180px' }}
                         className="w-full bg-gradient-to-t from-teal-700 to-teal-400 rounded-t-lg relative shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-teal-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                            LİDER
                         </div>
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-black/40 text-[10px] font-bold font-mono -rotate-90 origin-bottom mb-4 whitespace-nowrap">
                            Ortak Alan
                         </div>
                      </motion.div>
                  </div>
               </div>

               <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                     <span className="text-gray-400">Toplam Tasarruf Payı</span>
                     <span className="text-teal-400 font-bold">%{commonPct.toFixed(1)} Site Yönetimi</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-teal-500" style={{ width: `${commonPct}%` }} />
                  </div>
               </div>
            </div>
            
            <div className="mt-4 p-3 bg-teal-950/20 border-l-2 border-teal-500 rounded-r text-xs text-teal-100/80 font-mono leading-relaxed">
               Site yönetimleri için en büyük ROI, ortak alan sızıntılarını erken tespit ederek <span className="text-white font-bold">işletme maliyetlerini %{stats.roiStats.maintenanceCostReduction}</span> düşürmektir.
            </div>
        </div>

        {/* COL 2: Customer Penetration Map */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col gap-6">
            <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider flex items-center gap-2">
                <MapPin size={14} /> HEDEF MÜŞTERİ PENETRASYONU
            </h3>

            <div className="flex-1 space-y-3">
               {stats.penetration.map((item, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ x: -10, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="group flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/60 border border-white/5 rounded-lg transition-colors cursor-default"
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                           item.phase === 3 ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' : 
                           item.phase === 2 ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 
                           'bg-gray-500/20 border-gray-500/50 text-gray-400'
                        }`}>
                           <span className="text-xs font-bold font-mono">{item.phase}</span>
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-200">{item.region}</div>
                           <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              {item.type === 'Municipality' ? <Building2 size={10}/> : <Users size={10}/>}
                              {item.type === 'Municipality' ? 'Belediye' : 'Site Yönetimi'}
                           </div>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <div className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                           item.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                           {item.status === 'Active' ? 'AKTİF' : 'BEKLEMEDE'}
                        </div>
                        <div className="text-[9px] text-gray-600 mt-1">
                           {item.phase === 3 ? 'Tam Ölçek' : item.phase === 2 ? 'Entegrasyon' : 'Pilot'}
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Mini Map Placeholder Visualization */}
            <div className="h-24 w-full bg-slate-950/50 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900 via-slate-950 to-slate-950" />
               <div className="flex gap-8 opacity-50">
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-mono">MARMARA</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-[8px] font-mono">EGE</span>
                   </div>
               </div>
            </div>
        </div>

        {/* COL 3: ESG Score & Action */}
        <div className="flex flex-col gap-6">
            
            {/* ESG Radar Chart (Simulated with Bars/Hexagon) */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex-1 flex flex-col">
                <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-6 flex items-center gap-2">
                    <ShieldCheck size={14} /> ESG UYUM SKORU
                </h3>
                
                <div className="flex-1 flex flex-col justify-center gap-4">
                   {[
                      { label: 'Su Tasarrufu (E)', val: stats.esgScore.water, color: 'bg-cyan-500' },
                      { label: 'Karbon Ayak İzi (E)', val: stats.esgScore.carbon, color: 'bg-emerald-500' },
                      { label: 'Toplumsal Farkındalık (S)', val: stats.esgScore.social, color: 'bg-purple-500' },
                      { label: 'Veri Şeffaflığı (G)', val: stats.esgScore.governance, color: 'bg-amber-500' },
                      { label: 'Operasyonel Verimlilik (G)', val: stats.esgScore.efficiency, color: 'bg-teal-500' },
                   ].map((metric) => (
                      <div key={metric.label}>
                         <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                            <span>{metric.label}</span>
                            <span className="text-white font-bold">{metric.val}/100</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${metric.val}%` }}
                               transition={{ duration: 1 }}
                               className={`h-full ${metric.color}`}
                            />
                         </div>
                      </div>
                   ))}
                </div>
            </div>

            {/* AI Action Button */}
           <button 
              onClick={() => onAnalyze(stats)}
              className="w-full py-6 bg-teal-900/50 hover:bg-teal-800/50 text-white rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all flex items-center justify-center gap-3 group border border-teal-500/50 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <Zap size={24} className="group-hover:scale-110 transition-transform duration-300 text-teal-300 fill-current" />
              <div className="text-left z-10">
                 <div className="font-mono font-bold text-sm tracking-widest text-teal-100">YEREL GÜÇLENME</div>
                 <div className="text-[10px] text-teal-300/70">Altyapı İyileştirme Stratejisi</div>
              </div>
           </button>

        </div>

      </div>
    </div>
  );
};

export default B2BHub;