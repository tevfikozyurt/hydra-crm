import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Battery, Wifi, Server, AlertOctagon, Cpu, Zap, Signal } from 'lucide-react';
import { TechStats } from '../types';

interface TechBackboneProps {
  onAnalyze: () => void;
}

const TechBackbone: React.FC<TechBackboneProps> = ({ onAnalyze }) => {
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [deviceType, setDeviceType] = useState('ALL');

  // Mock Data
  const stats: TechStats = {
    totalDevices: 12450,
    deviceHealth: {
      active: 11200,
      lowBattery: 850,
      offline: 400
    },
    signalQuality: [
      { region: 'İstanbul', rssi: -95, status: 'good', coverage: 98 },
      { region: 'Ankara', rssi: -115, status: 'fair', coverage: 85 },
      { region: 'İzmir', rssi: -85, status: 'good', coverage: 96 },
      { region: 'Adana', rssi: -128, status: 'poor', coverage: 72 },
    ],
    avgBatteryLifeYears: 8.4
  };

   // Region & Device filters
   const regionConfig: Record<string, { name: string; weakProb: number }> = {
      ALL: { name: 'Tüm Bölgeler', weakProb: 0.2 },
      IST: { name: 'İstanbul', weakProb: 0.1 },
      ANK: { name: 'Ankara', weakProb: 0.25 },
      IZM: { name: 'İzmir', weakProb: 0.12 },
   };
   const activeRegionConf = regionConfig[activeRegion] ?? regionConfig.ALL;

   const deviceFactorMap: Record<string, number> = { ALL: 1, RES: 0.6, IND: 0.25, PUB: 0.15 };
   const deviceFactor = deviceFactorMap[deviceType] ?? 1;

   const viewTotalDevices = useMemo(() => Math.round(stats.totalDevices * deviceFactor), [stats.totalDevices, deviceFactor]);
   const ratios = useMemo(() => ({
      active: stats.deviceHealth.active / stats.totalDevices,
      lowBattery: stats.deviceHealth.lowBattery / stats.totalDevices,
      offline: stats.deviceHealth.offline / stats.totalDevices,
   }), [stats]);
   const viewDeviceHealth = useMemo(() => ({
      active: Math.round(viewTotalDevices * ratios.active),
      lowBattery: Math.round(viewTotalDevices * ratios.lowBattery),
      offline: Math.round(viewTotalDevices * ratios.offline),
   }), [viewTotalDevices, ratios]);

   // Pie Chart Calculation (uses filtered totals)
   const healthTotal = viewTotalDevices;
   const activePct = (viewDeviceHealth.active / healthTotal) * 100;
   const warnPct = (viewDeviceHealth.lowBattery / healthTotal) * 100;
   const offlinePct = (viewDeviceHealth.offline / healthTotal) * 100;
   const [hoverSeg, setHoverSeg] = useState<null | 'active' | 'warn' | 'offline'>(null);

   // Signal Map Grid (Simulated, depends on region)
   const signalGrid = useMemo(() => {
      const weakThreshold = 1 - activeRegionConf.weakProb; // higher weakProb -> more weak cells
      return Array.from({ length: 48 }, (_, i) => {
         const isWeak = Math.random() > weakThreshold;
         return {
            id: i,
            strength: isWeak ? Math.floor(Math.random() * 40) : Math.floor(Math.random() * 40) + 60,
            status: isWeak ? 'poor' : 'good'
         };
      });
   }, [activeRegionConf]);

   // Visible regional list
   const visibleSignalQuality = activeRegion === 'ALL'
      ? stats.signalQuality
      : stats.signalQuality.filter(r => r.region === activeRegionConf.name);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-purple-950 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between relative overflow-hidden gap-4">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         
         <div className="z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
               <Network className="text-purple-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-mono font-bold text-purple-400">
                  TEKNOLOJİK OMURGA KONTROL
               </h2>
               <p className="text-purple-200/60 font-mono text-sm mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {activeRegion === 'ALL' ? (
                    <>LoRaWAN Ağı: AKTİF - Ortalama Kapsama: %{Math.round(stats.signalQuality.reduce((a,b)=>a+b.coverage,0)/stats.signalQuality.length)}</>
                  ) : (
                    <>Bölge: {activeRegionConf.name} - Kapsama: %{visibleSignalQuality[0]?.coverage ?? 90}</>
                  )}
               </p>
            </div>
         </div>

         {/* Filters */}
         <div className="flex gap-3 z-10">
            <select 
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="bg-slate-950/80 border border-purple-500/30 text-purple-100 text-xs font-mono rounded px-3 py-2 outline-none focus:border-purple-400"
            >
               <option value="ALL">Tüm Bölgeler</option>
               <option value="IST">İstanbul</option>
               <option value="ANK">Ankara</option>
               <option value="IZM">İzmir</option>
            </select>
            <select 
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="bg-slate-950/80 border border-purple-500/30 text-purple-100 text-xs font-mono rounded px-3 py-2 outline-none focus:border-purple-400"
            >
               <option value="ALL">Tüm Cihazlar</option>
               <option value="RES">Konut</option>
               <option value="IND">Endüstriyel</option>
               <option value="PUB">Kamusal</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        
        {/* COL 1: Device Health (Donut) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md flex-1 flex flex-col items-center justify-center relative">
              <h3 className="absolute top-4 left-4 text-xs font-mono font-bold text-gray-400 tracking-wider flex items-center gap-2">
                 <Server size={14} /> CİHAZ DURUMU
              </h3>
              
              <div className="relative w-48 h-48 mt-4">
                 <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <defs>
                      <linearGradient id="gradActive" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="gradWarn" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="gradOffline" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="4" />
                    {/* Active */}
                    <motion.path 
                       initial={{ strokeDasharray: "0, 100" }}
                       animate={{ strokeDasharray: `${activePct}, 100` }}
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                       fill="none" stroke={hoverSeg === 'active' ? '#34d399' : 'url(#gradActive)'} strokeWidth="4" 
                       onMouseEnter={()=>setHoverSeg('active')} onMouseLeave={()=>setHoverSeg(null)}
                    />
                    {/* Warning */}
                    <motion.path 
                       initial={{ strokeDasharray: "0, 100" }}
                       animate={{ strokeDasharray: `${warnPct}, 100` }}
                       style={{ strokeDashoffset: -activePct }}
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                       fill="none" stroke={hoverSeg === 'warn' ? '#fbbf24' : 'url(#gradWarn)'} strokeWidth="4" 
                       onMouseEnter={()=>setHoverSeg('warn')} onMouseLeave={()=>setHoverSeg(null)}
                    />
                    {/* Offline */}
                    <motion.path 
                       initial={{ strokeDasharray: "0, 100" }}
                       animate={{ strokeDasharray: `${offlinePct}, 100` }}
                       style={{ strokeDashoffset: -(activePct + warnPct) }}
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                       fill="none" stroke={hoverSeg === 'offline' ? '#f87171' : 'url(#gradOffline)'} strokeWidth="4" 
                       onMouseEnter={()=>setHoverSeg('offline')} onMouseLeave={()=>setHoverSeg(null)}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white font-mono">{viewTotalDevices.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Toplam Modül</span>
                    {hoverSeg && (
                      <div className="mt-2 px-2 py-1 rounded bg-slate-900/80 border border-white/10 text-[10px] text-white font-mono">
                        {hoverSeg === 'active' && (<span>Aktif: {viewDeviceHealth.active.toLocaleString()} (%{activePct.toFixed(1)})</span>)}
                        {hoverSeg === 'warn' && (<span>Pil Zayıf: {viewDeviceHealth.lowBattery.toLocaleString()} (%{warnPct.toFixed(1)})</span>)}
                        {hoverSeg === 'offline' && (<span>Çevrimdışı: {viewDeviceHealth.offline.toLocaleString()} (%{offlinePct.toFixed(1)})</span>)}
                      </div>
                    )}
                 </div>
              </div>

              <div className="w-full mt-6 space-y-2">
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Aktif</span>
                    <span className="text-white font-bold">{viewDeviceHealth.active} (%{activePct.toFixed(1)})</span>
                 </div>
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/> Pil Zayıf</span>
                    <span className="text-amber-400 font-bold">{viewDeviceHealth.lowBattery} (%{warnPct.toFixed(1)})</span>
                 </div>
                 <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"/> Çevrimdışı</span>
                    <span className="text-red-400 font-bold">{viewDeviceHealth.offline} (%{offlinePct.toFixed(1)})</span>
                 </div>
              </div>
           </div>
        </div>

        {/* COL 2: Signal Map & Battery (Middle) */}
        <div className="md:col-span-8 lg:col-span-6 flex flex-col gap-6">
           
           {/* Signal Quality Matrix */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md flex-1">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xs font-mono font-bold text-purple-400 tracking-wider flex items-center gap-2">
                    <Wifi size={14} /> LoRaWAN SİNYAL MATRİSİ
                 </h3>
                 <div className="flex gap-2 text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-purple-500/50 rounded-sm"/> Güçlü</span>
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-900/50 rounded-sm"/> Zayıf (Kör Nokta)</span>
                 </div>
              </div>

              <div className="grid grid-cols-8 gap-1 h-48">
                 {signalGrid.map((cell) => (
                    <motion.div
                       key={cell.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: cell.id * 0.01 }}
                       className={`rounded-sm relative group cursor-crosshair ${
                          cell.status === 'good' ? 'bg-purple-500/20 hover:bg-purple-500/60' : 'bg-red-500/10 hover:bg-red-500/40'
                       } transition-colors`}
                    >
                       <div className={`absolute bottom-0 left-0 w-full bg-current opacity-30 ${cell.status === 'good' ? 'text-purple-500' : 'text-red-500'}`} style={{ height: `${cell.strength}%` }} />
                       
                       {/* Tooltip */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-950 border border-white/10 text-[9px] text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 font-mono">
                          GW-{100 + cell.id} : {cell.strength}dB
                       </div>
                    </motion.div>
                 ))}
              </div>

              {/* Story */}
              <div className="mt-4 p-3 bg-red-950/20 border-l-2 border-red-500/50 rounded-r text-xs text-red-200/80 font-mono">
                 <AlertOctagon size={12} className="inline mr-2 text-red-500" />
                 Sinyal kalitesi düşük olan <span className="text-white font-bold">Adana (Sektör-4)</span> bölgesi, toplam veri kaybının <span className="text-white font-bold">%65'ini</span> oluşturmaktadır.
              </div>
           </div>

           {/* Battery Life Projection */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-mono font-bold text-amber-400 tracking-wider flex items-center gap-2 mb-4">
                 <Battery size={14} /> PİL ÖMRÜ PROJEKSİYONU (10 YIL)
              </h3>
              
              <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden">
                 {/* Progress */}
                 <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(stats.avgBatteryLifeYears / 10) * 100}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
                 />
                 {/* Markers */}
                 <div className="absolute inset-0 flex justify-between px-2 items-center text-[9px] font-mono text-black font-bold opacity-50">
                     <span>10Y</span>
                     <span>8Y</span>
                     <span>5Y</span>
                     <span>2Y</span>
                     <span>0</span>
                 </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-xs text-gray-400 font-mono">Kalan Ortalama: <span className="text-white font-bold">{stats.avgBatteryLifeYears} Yıl</span></span>
                 <span className="text-[10px] text-green-400 font-mono flex items-center gap-1"><Zap size={10}/> Ultra-Low Power Modu Aktif</span>
              </div>
           </div>

        </div>

        {/* COL 3: Action & Regional Status */}
        <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-6">
           
           {/* Regional List */}
           <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md flex-1">
              <h3 className="text-xs font-mono font-bold text-gray-400 mb-4">BÖLGESEL AĞ SAĞLIĞI</h3>
              <div className="space-y-3">
                 {stats.signalQuality.map((reg) => (
                    <div key={reg.region} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group cursor-default">
                       <div>
                          <div className="text-sm font-bold text-gray-200 font-mono">{reg.region}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1">
                             <Signal size={10} /> {reg.rssi} dBm
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-xs font-bold font-mono ${
                             reg.status === 'good' ? 'text-emerald-400' :
                             reg.status === 'fair' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                             %{reg.coverage}
                          </div>
                          <div className="text-[9px] text-gray-600">Kapsama</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* AI Action Button */}
           <button 
              onClick={onAnalyze}
              className="w-full py-6 bg-purple-900/50 hover:bg-purple-800/50 text-white rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all flex items-center justify-center gap-3 group border border-purple-500/50 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <Cpu size={24} className="group-hover:rotate-180 transition-transform duration-700 text-purple-300" />
              <div className="text-left z-10">
                 <div className="font-mono font-bold text-sm tracking-widest text-purple-100">ALTYAPI OPTİMİZASYONU</div>
                 <div className="text-[10px] text-purple-300/70">OpEx Düşürme & Gateway Planlama</div>
              </div>
           </button>
        </div>

      </div>
    </div>
  );
};

export default TechBackbone;