import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, TrendingDown, Globe } from 'lucide-react';

const WaterLegacySection: React.FC = () => {
  // Statik Veriler (Gerçek Türkiye Verilerine Yakın Simülasyon)
  // Türkiye şu an "Su Stresi" altındaki ülkeler kategorisindedir (~1323 m3).
  // 1700 m3 altı: Stres, 1000 m3 altı: Kıtlık.
  const nationalWaterPerCapita = 1323; 
  const stressThreshold = 1700;
  const scarcityThreshold = 1000;
  
  const cities = [
    { name: 'İSTANBUL', value: 180, limit: 150 }, // High consumption
    { name: 'ANKARA', value: 138, limit: 150 },   // Good
    { name: 'İZMİR', value: 165, limit: 150 },    // Warning
    { name: 'BURSA', value: 142, limit: 150 },    // Good
  ];
  
  const globalAvg = 210; // Mock Global Average for comparison
  const hydraAvg = 135;  // Hydra Target

  // Story Logic
  const stressGap = nationalWaterPerCapita - scarcityThreshold;
  const hydraEfficiency = Math.round(((globalAvg - hydraAvg) / globalAvg) * 100);

  return (
    <div className="w-full bg-slate-900/40 border border-cyan-900/30 rounded-xl backdrop-blur-md overflow-hidden mt-6 relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-transparent to-transparent opacity-50" />
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
         <h3 className="font-mono font-bold text-gray-100 flex items-center gap-2 tracking-widest">
            <Globe className="text-cyan-500" size={16} />
            TÜRKİYE'NİN SU MİRASI & TÜKETİM MUKAYESESİ
         </h3>
         <div className="text-[10px] font-mono text-gray-500 bg-slate-950/50 px-2 py-1 rounded border border-white/5">
            VERİ KAYNAĞI: ULUSAL SU ENVANTERİ
         </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: National Water Stress (The Funnel of Scarcity) */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-gray-400">ULUSAL SU POTANSİYELİ (m³/Kişi/Yıl)</span>
              <span className="text-hydra-alert animate-pulse flex items-center gap-1">
                 <AlertTriangle size={12} /> KRİTİK EŞİĞE YAKLAŞILIYOR
              </span>
           </div>

           {/* Custom Gauge Graphic */}
           <div className="relative h-24 w-full bg-slate-950/50 rounded-lg border border-white/5 p-4 flex items-center">
              {/* Threshold Lines */}
              <div className="absolute top-0 bottom-0 left-[20%] border-l border-red-500/30 z-10">
                 <span className="absolute -top-3 -left-3 text-[9px] text-red-500 font-mono">KITLIK (1000)</span>
              </div>
              <div className="absolute top-0 bottom-0 left-[60%] border-l border-amber-500/30 z-10">
                 <span className="absolute -top-3 -left-3 text-[9px] text-amber-500 font-mono">STRES (1700)</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative">
                 {/* Safe Zone */}
                 <div className="absolute right-0 h-full w-[40%] bg-gradient-to-l from-cyan-900 to-transparent opacity-30" />
                 
                 {/* Current Value Bar (Inverted visually: Less is left/worse) */}
                 {/* Mapping: 0=500m3, 100=4000m3 roughly */}
                 <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '35%' }} // Approximating 1323 on the scale
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] relative"
                 >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-8 bg-white border-2 border-slate-900 shadow-lg rounded flex items-center justify-center z-20">
                       <div className="w-1 h-4 bg-slate-900 rounded-full" />
                    </div>
                 </motion.div>
              </div>
              
              <div className="absolute bottom-2 right-[65%] text-xs font-bold text-white font-mono z-20 drop-shadow-md">
                 {nationalWaterPerCapita} m³
              </div>
           </div>

           {/* Story Text */}
           <div className="bg-amber-950/10 border-l-2 border-amber-500 p-3 rounded-r-lg">
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                 Türkiye, <span className="text-white font-bold">{nationalWaterPerCapita} m³</span> ile su stresi eşiğinin altında bulunmaktadır. 
                 Kıtlık sınırına (1000 m³) sadece <span className="text-red-400 font-bold">{stressGap} m³</span> kalmıştır. 
                 Kriz gelecekte değil, <span className="underline decoration-red-500/50">şimdi yaşanmaktadır.</span>
              </p>
           </div>
        </div>

        {/* RIGHT: Regional Consumption (3D Pillars) */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-gray-400">BÖLGESEL TÜKETİM (Litre/Kişi/Gün)</span>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-sm"/> <span className="text-gray-500">Şehir</span></div>
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-600 rounded-sm"/> <span className="text-gray-500">Global Ort.</span></div>
              </div>
           </div>

           <div className="flex items-end justify-between h-32 px-2 gap-2">
              {cities.map((city, idx) => (
                 <div key={city.name} className="flex-1 flex flex-col items-center justify-end group">
                    <div className="relative w-full flex items-end justify-center">
                       {/* Global Benchmark Line */}
                       <div 
                          className="absolute bottom-0 w-full border-t border-slate-600/50 border-dashed z-0" 
                          style={{ height: `${(globalAvg / 250) * 100}%` }} 
                       />
                       
                       {/* City Bar */}
                       <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(city.value / 250) * 100}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`w-full max-w-[40px] relative ${
                             city.value > city.limit ? 'bg-gradient-to-t from-amber-600 to-amber-400' : 'bg-gradient-to-t from-cyan-900 to-cyan-500'
                          } opacity-80 backdrop-blur-sm rounded-t-sm group-hover:opacity-100 transition-opacity`}
                       >
                          {/* Top Face (Fake 3D) */}
                          <div className={`absolute -top-1 left-0 w-full h-1 ${
                             city.value > city.limit ? 'bg-amber-300' : 'bg-cyan-300'
                          } opacity-50 skew-x-12 origin-bottom-left`} />
                          
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                             {city.value}L
                          </span>
                       </motion.div>
                    </div>
                    <span className="mt-2 text-[10px] text-gray-400 font-mono tracking-tighter">{city.name}</span>
                 </div>
              ))}
           </div>

           {/* Hydra Impact Story */}
           <div className="bg-cyan-950/20 border-l-2 border-cyan-500 p-3 rounded-r-lg flex items-center justify-between">
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                 Hydra bölgeleri, küresel ortalamanın <span className="text-cyan-400 font-bold">%{hydraEfficiency}</span> altında tüketim yaparak "Miras Koruyucusu" seviyesindedir.
              </p>
              <TrendingDown className="text-cyan-400" size={20} />
           </div>
        </div>

      </div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
    </div>
  );
};

export default WaterLegacySection;