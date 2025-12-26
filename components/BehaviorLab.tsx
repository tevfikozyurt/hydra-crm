import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Sprout, Cat, Users, ArrowRight, Lightbulb, BrainCircuit } from 'lucide-react';
import { GamificationStats, Badge } from '../types';

interface BehaviorLabProps {
  onAnalyze: () => void;
}

const BehaviorLab: React.FC<BehaviorLabProps> = ({ onAnalyze }) => {
  
  // Mock Data
  const stats: GamificationStats = {
    totalBadges: 1420,
    leaderboardRank: 14,
    avgScoreTrend: [65, 68, 72, 70, 75, 78, 82, 85, 84, 88],
    impactTrees: 340,
    impactAnimals: 1250,
    aiAdoptionRate: 42,
    aiSavingsDelta: 22 // AI users save 22% more
  };

  const badges: Badge[] = [
    { id: '1', name: 'KAÇAK AVCISI', icon: 'shield', count: 450, description: 'Sızıntıyı 10dk içinde raporlayanlar' },
    { id: '2', name: 'GECE BEKÇİSİ', icon: 'zap', count: 320, description: '02:00-05:00 arası 0 tüketim' },
    { id: '3', name: 'EKO LİDER', icon: 'award', count: 120, description: 'Bölgesinde en az tüketen ilk %5' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         <div className="z-10">
            <h2 className="text-2xl font-mono font-bold text-emerald-400 flex items-center gap-3">
               <Sprout size={28} /> DAVRANIŞ DEĞİŞİM LABORATUVARI
            </h2>
            <p className="text-emerald-200/60 font-mono text-sm mt-1">
               Oyunlaştırma, sosyal etki ve alışkanlık analizi modülü.
            </p>
         </div>
         <div className="hidden md:flex items-center gap-4 z-10">
            <div className="text-right">
               <div className="text-xs text-emerald-500/70 font-bold uppercase tracking-widest">TOPLAM ETKİ PUANI</div>
               <div className="text-3xl font-bold text-emerald-400 font-mono">842,910</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* COL 1: Gamification & Badges */}
        <div className="space-y-6">
           {/* Score Trend */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-mono font-bold text-gray-400 mb-4 flex items-center gap-2">
                 <Award size={14} className="text-amber-400" /> TOPLUMSAL SKOR TRENDİ
              </h3>
              <div className="h-32 w-full flex items-end justify-between gap-1">
                 {stats.avgScoreTrend.map((score, i) => (
                    <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       animate={{ height: `${score}%` }}
                       transition={{ delay: i * 0.05 }}
                       className="w-full bg-gradient-to-t from-emerald-900 to-emerald-500 rounded-t-sm relative group"
                    >
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white bg-slate-900 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {score}
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Badges Grid */}
           <div className="grid gap-3">
              {badges.map((badge, i) => (
                 <motion.div 
                    key={badge.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-4 bg-slate-900/40 border border-white/5 p-3 rounded-lg hover:border-amber-500/50 transition-colors group"
                 >
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                       {badge.icon === 'shield' && <Users className="text-amber-400" />}
                       {badge.icon === 'zap' && <Zap className="text-amber-400" />}
                       {badge.icon === 'award' && <Award className="text-amber-400" />}
                    </div>
                    <div>
                       <div className="text-sm font-bold text-amber-100 font-mono">{badge.name}</div>
                       <div className="text-[10px] text-gray-400">{badge.description}</div>
                       <div className="mt-1 h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${Math.random() * 100}%` }} />
                       </div>
                    </div>
                    <div className="ml-auto text-xl font-bold text-amber-500/50 font-mono">
                       {badge.count}
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* COL 2: Impact Visualization (The Concrete Reality) */}
        <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-6 backdrop-blur-md flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sprout size={120} className="text-emerald-500" />
           </div>
           
           <h3 className="text-xs font-mono font-bold text-emerald-400 mb-6 tracking-widest uppercase z-10">
              SOMUT ETKİ GÖRSELLEŞTİRMESİ
           </h3>

           <div className="flex-1 flex flex-col gap-8 z-10">
              {/* Trees */}
              <div className="group">
                 <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-emerald-300 font-mono">{stats.impactTrees}</span>
                    <span className="text-sm text-emerald-500/60 font-mono mb-1">Ağaç Kurtarıldı</span>
                 </div>
                 {/* Visual Grid for Trees */}
                 <div className="flex flex-wrap gap-1">
                    {[...Array(40)].map((_, i) => (
                       <motion.div 
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: Math.random() * 1 }}
                          className={`w-2 h-4 rounded-t-full ${i < 28 ? 'bg-emerald-500' : 'bg-emerald-900/30'}`} 
                       />
                    ))}
                 </div>
              </div>

              {/* Animals */}
              <div className="group">
                 <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-cyan-300 font-mono">{stats.impactAnimals}</span>
                    <span className="text-sm text-cyan-500/60 font-mono mb-1">Hayvanın Su İhtiyacı</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '85%' }}
                       transition={{ duration: 2 }}
                       className="h-full bg-cyan-500"
                    />
                 </div>
                 <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                    <span>Bugün</span>
                    <span>Hedef: 2000</span>
                 </div>
              </div>
           </div>

           {/* Storytelling Box */}
           <div className="mt-8 bg-emerald-950/40 border-l-2 border-emerald-500 p-4 rounded-r-lg">
              <p className="text-xs text-emerald-100/80 leading-relaxed font-mono">
                 En çok tasarruf eden <span className="text-white font-bold">%10'luk kesim</span>, 'Kaçak Avcısı' rozetini en sık kazananlardır. 
                 Rekabet, tasarrufu <span className="text-emerald-400 font-bold">%{stats.aiSavingsDelta}</span> oranında artırmaktadır.
              </p>
           </div>
        </div>

        {/* COL 3: AI Benefit Analysis & Action */}
        <div className="flex flex-col gap-6">
           
           {/* Comparison Chart */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex-1">
              <h3 className="text-xs font-mono font-bold text-gray-400 mb-6 uppercase">AI ÖNERİSİNE UYUM FARKI</h3>
              
              <div className="flex flex-col gap-6">
                 {/* AI Users */}
                 <div className="relative">
                    <div className="flex justify-between text-xs text-gray-400 mb-1 font-mono">
                       <span className="flex items-center gap-1"><BrainCircuit size={12} className="text-cyan-400"/> AI Kullananlar</span>
                       <span className="text-cyan-400 font-bold">-{stats.aiSavingsDelta}% Tasarruf</span>
                    </div>
                    <div className="w-full h-8 bg-slate-800 rounded overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 flex items-center justify-end pr-2"
                       >
                          <span className="text-[10px] text-black font-bold">142 L/Gün</span>
                       </motion.div>
                    </div>
                 </div>

                 {/* Non-AI Users */}
                 <div className="relative opacity-60">
                     <div className="flex justify-between text-xs text-gray-400 mb-1 font-mono">
                       <span className="flex items-center gap-1"><Users size={12} /> Klasik Kullanıcılar</span>
                       <span>0% (Baz)</span>
                    </div>
                    <div className="w-full h-8 bg-slate-800 rounded overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1 }}
                          className="h-full bg-slate-600 flex items-center justify-end pr-2"
                       >
                          <span className="text-[10px] text-white font-bold">185 L/Gün</span>
                       </motion.div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 flex items-center gap-3 text-xs text-gray-400">
                 <ArrowRight className="text-cyan-500" />
                 <p>AI destekli bulaşık/duş önerileri hane başı tüketimi yıllık <span className="text-white font-bold">45 Ton</span> düşürmüştür.</p>
              </div>
           </div>

           {/* AI Action Button */}
           <button 
              onClick={onAnalyze}
              className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 group border border-emerald-400/20"
           >
              <Lightbulb size={24} className="group-hover:text-yellow-300 transition-colors" />
              <div className="text-left">
                 <div className="font-mono font-bold text-sm tracking-widest">KAMPANYA OLUŞTUR</div>
                 <div className="text-[10px] text-emerald-100/70">AI Destekli Davranış Kurgusu</div>
              </div>
           </button>
        </div>

      </div>
    </div>
  );
};

export default BehaviorLab;