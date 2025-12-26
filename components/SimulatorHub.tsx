import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SimulationParams, SimulationStats } from '../types';
import { Calculator, CloudRain, Users, DollarSign, BrainCircuit, AlertTriangle, PlayCircle, History, Clock } from 'lucide-react';

interface SimulatorHubProps {
  onAnalyze: (params: SimulationParams, stats: SimulationStats) => void;
}

const SimulatorHub: React.FC<SimulatorHubProps> = ({ onAnalyze }) => {
  
  // State for inputs
  const [params, setParams] = useState<SimulationParams>({
    pricingChange: 0,
    aiAdoption: 25,
    rainfall: 'normal',
    populationGrowth: 1.2
  });

  // Derived Statistics (Simulation Logic)
  const stats: SimulationStats = useMemo(() => {
    // Baseline constants
    const currentConsumption = 142; // L/day/person
    const supplyLimitPerCapita = 180; // Supply limit (decreases with drought)

    // Factors
    const rainFactor = params.rainfall === 'drought' ? 0.7 : params.rainfall === 'wet' ? 1.2 : 1.0;
    const aiEfficiency = 0.3; // Max 30% savings with 100% adoption
    const priceElasticity = 0.2; // 10% price hike = 2% drop in demand

    // Future Projection Loop (10 years)
    let years = 0;
    let consumption = currentConsumption;
    let supply = supplyLimitPerCapita * rainFactor;
    let risk = 0;

    // Apply immediate impacts
    const aiImpact = (params.aiAdoption / 100) * aiEfficiency;
    const priceImpact = (params.pricingChange / 100) * priceElasticity;
    
    // Initial adjusted consumption
    consumption = consumption * (1 - aiImpact) * (1 - priceImpact);

    // Bill calculation (Base bill 500 TL)
    const projectedBill = 500 * (1 + (params.pricingChange/100)) * (consumption / currentConsumption);

    // Find intersection (Scarcity Point)
    for (let i = 1; i <= 10; i++) {
        // Population growth increases total demand strain, effectively lowering per capita supply share
        consumption = consumption * (1 + (params.populationGrowth / 100));
        
        if (consumption > supply) {
            years = i + (Math.random() * 0.5); // Add some decimal for visuals
            break;
        }
    }

    if (years === 0) years = 10; // Safe for 10+ years
    
    // Calculate Risk Score (0-100)
    risk = Math.min(100, (consumption / supply) * 100);
    if (params.rainfall === 'drought') risk += 20;

    return {
        yearsToScarcity: years === 10 ? 'SAFE' : Number(years.toFixed(1)),
        projectedConsumption: Math.round(consumption),
        projectedBill: Math.round(projectedBill),
        scarcityRisk: Math.min(100, Math.round(risk))
    };
  }, [params]);

  // Graph Data Points with Uncertainty Bands
  const graphPoints = useMemo(() => {
     const points = [];
     const currentConsumption = 142;
     const rainFactor = params.rainfall === 'drought' ? 0.7 : params.rainfall === 'wet' ? 1.2 : 1.0;
     const supplyLimit = 180 * rainFactor;
     
     const aiImpact = (params.aiAdoption / 100) * 0.3;
     const priceImpact = (params.pricingChange / 100) * 0.2;
     
     // Base starting consumption
     let c = currentConsumption * (1 - aiImpact) * (1 - priceImpact);

     for(let i=0; i<=10; i++) {
        // Uncertainty cone expands over time (Confidence Interval)
        // Base uncertainty 2% + 1.5% per year
        const uncertaintyFactor = 0.02 + (i * 0.015);
        
        points.push({ 
            year: i, 
            consumption: c, 
            supply: supplyLimit,
            upper: c * (1 + uncertaintyFactor), // Worst case (Higher consumption)
            lower: c * (1 - uncertaintyFactor)  // Best case (Lower consumption)
        });
        
        c = c * (1 + (params.populationGrowth / 100));
     }
     return points;
  }, [params]);

  // Y-Axis Scaling Helper
  const getY = (val: number) => {
      // Map domain [0, 250] to range [100, 0] within SVG
      const maxVal = 250;
      return 100 - (val / maxVal) * 100;
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
         
         <div className="z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50">
               <Calculator className="text-indigo-400" size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-mono font-bold text-indigo-400">
                  WHAT-IF KRİZ SİMÜLATÖRÜ
               </h2>
               <p className="text-indigo-200/60 font-mono text-sm mt-1 flex items-center gap-2">
                  <PlayCircle size={14} className="text-white" />
                  Gelecek Senaryoları: <span className="text-white font-bold">AKTİF</span>
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex-1">
                <h3 className="text-xs font-mono font-bold text-gray-400 tracking-wider mb-6 flex items-center gap-2">
                    <History size={14} /> DEĞİŞKENLER
                </h3>

                <div className="space-y-8">
                    {/* Slider 1: Pricing */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-gray-300">
                            <span className="flex items-center gap-2"><DollarSign size={14} className="text-emerald-400"/> Fiyatlandırma Politikası</span>
                            <span className={params.pricingChange > 0 ? 'text-emerald-400' : 'text-red-400'}>{params.pricingChange > 0 ? '+' : ''}{params.pricingChange}%</span>
                        </div>
                        <input 
                            type="range" min="-20" max="50" step="5"
                            value={params.pricingChange}
                            onChange={(e) => setParams({...params, pricingChange: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Sübvanse (-20%)</span>
                            <span>Caydırıcı (+50%)</span>
                        </div>
                    </div>

                    {/* Slider 2: AI Adoption */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-gray-300">
                            <span className="flex items-center gap-2"><BrainCircuit size={14} className="text-cyan-400"/> AI Benimseme Oranı</span>
                            <span className="text-cyan-400">%{params.aiAdoption}</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" step="10"
                            value={params.aiAdoption}
                            onChange={(e) => setParams({...params, aiAdoption: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                         <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Yok (0%)</span>
                            <span>Tam Entegrasyon (100%)</span>
                        </div>
                    </div>

                    {/* Slider 3: Rainfall */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-gray-300">
                            <span className="flex items-center gap-2"><CloudRain size={14} className="text-blue-400"/> Yağış Rejimi</span>
                            <span className="uppercase text-blue-400">{params.rainfall === 'wet' ? 'YAĞIŞLI' : params.rainfall === 'drought' ? 'KURAKLIK' : 'NORMAL'}</span>
                        </div>
                        <div className="flex bg-slate-800 rounded p-1">
                            {['drought', 'normal', 'wet'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setParams({...params, rainfall: opt as any})}
                                    className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${params.rainfall === opt ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {opt === 'drought' ? 'KURAK' : opt === 'wet' ? 'BOL' : 'NORM'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slider 4: Pop Growth */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-gray-300">
                            <span className="flex items-center gap-2"><Users size={14} className="text-amber-400"/> Nüfus Artışı (Yıllık)</span>
                            <span className="text-amber-400">%{params.populationGrowth}</span>
                        </div>
                        <input 
                            type="range" min="0" max="5" step="0.1"
                            value={params.populationGrowth}
                            onChange={(e) => setParams({...params, populationGrowth: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* CENTER/RIGHT COLUMN: Visualization & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* The Predictive Graph */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-6 backdrop-blur-md h-96 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                <div className="absolute top-4 right-4 z-10 bg-indigo-950/80 px-3 py-1 rounded text-xs font-mono text-indigo-300 border border-indigo-500/30 flex items-center gap-2">
                    <History size={12} /> 10 Yıllık Projeksiyon
                </div>

                {/* SVG Chart Container */}
                <div className="w-full h-full pt-8 pb-4 pl-4 relative">
                     <svg className="w-full h-full overflow-visible" viewBox="0 0 110 100" preserveAspectRatio="none">
                         <defs>
                            {/* Area Gradient */}
                            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={stats.scarcityRisk > 90 ? '#ef4444' : '#6366f1'} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={stats.scarcityRisk > 90 ? '#ef4444' : '#6366f1'} stopOpacity="0" />
                            </linearGradient>
                            
                            {/* Glow Filters */}
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                         </defs>

                         {/* GRID LINES & AXIS LABELS */}
                         {/* Y-Axis Grid (Horizontal) */}
                         {[100, 150, 200, 250].map((val) => (
                             <g key={val}>
                                 <line x1="10" y1={getY(val)} x2="110" y2={getY(val)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                 <text x="8" y={getY(val) + 1} fill="#64748b" fontSize="3" fontFamily="monospace" textAnchor="end">{val}L</text>
                             </g>
                         ))}

                         {/* X-Axis Grid (Vertical) */}
                         {[0, 2, 4, 6, 8, 10].map((year) => (
                             <g key={year}>
                                 <line x1={10 + (year*10)} y1="0" x2={10 + (year*10)} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                 <text x={10 + (year*10)} y="105" fill="#64748b" fontSize="3" fontFamily="monospace" textAnchor="middle">{year}Y</text>
                             </g>
                         ))}

                         {/* SUPPLY LIMIT LINE (Dashed) */}
                         <g>
                             <line 
                                x1="10" y1={getY(graphPoints[0].supply)} 
                                x2="110" y2={getY(graphPoints[0].supply)} 
                                stroke={params.rainfall === 'drought' ? '#ef4444' : '#3b82f6'} 
                                strokeWidth="1" strokeDasharray="2,2" opacity="0.8" 
                             />
                             <text x="110" y={getY(graphPoints[0].supply) - 2} fill={params.rainfall === 'drought' ? '#ef4444' : '#3b82f6'} fontSize="3" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                                 ARZ LİMİTİ ({Math.round(graphPoints[0].supply)} L)
                             </text>
                         </g>

                         {/* UNCERTAINTY BAND (Shadow Band - 95% Confidence) */}
                         <motion.path
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            d={`
                              M 10,${getY(graphPoints[0].upper)}
                              ${graphPoints.map(p => `L ${10 + (p.year*10)},${getY(p.upper)}`).join(' ')}
                              ${[...graphPoints].reverse().map(p => `L ${10 + (p.year*10)},${getY(p.lower)}`).join(' ')}
                              Z
                            `}
                            fill="rgba(99, 102, 241, 0.1)"
                            stroke="rgba(99, 102, 241, 0.15)"
                            strokeWidth="0.5"
                         />

                         {/* CONSUMPTION AREA & LINE */}
                         {/* Area Fill */}
                         <motion.path
                             initial={false}
                             animate={{ d: `M 10,${getY(graphPoints[0].consumption)} ` + 
                                graphPoints.map((p) => `L ${10 + (p.year*10)},${getY(p.consumption)}`).join(' ') + 
                                ` L 110,100 L 10,100 Z` 
                             }}
                             transition={{ type: "tween", duration: 0.5 }}
                             fill="url(#consumptionGradient)"
                         />

                         {/* Line Stroke */}
                         <motion.path
                             initial={false}
                             animate={{ d: `M 10,${getY(graphPoints[0].consumption)} ` + graphPoints.map((p) => `L ${10 + (p.year*10)},${getY(p.consumption)}`).join(' ') }}
                             transition={{ type: "spring", stiffness: 50 }}
                             fill="none"
                             stroke={stats.scarcityRisk > 90 ? '#ef4444' : '#6366f1'}
                             strokeWidth="2"
                             strokeLinecap="round"
                             filter="url(#glow)"
                             vectorEffect="non-scaling-stroke"
                         />

                         {/* INTERSECTION / CRISIS POINT */}
                         {stats.yearsToScarcity !== 'SAFE' && (
                             <g>
                                 {/* Vertical Drop Line */}
                                 <line 
                                    x1={10 + (Number(stats.yearsToScarcity) * 10)} 
                                    y1={getY(graphPoints[Math.floor(Number(stats.yearsToScarcity))].supply)} 
                                    x2={10 + (Number(stats.yearsToScarcity) * 10)} 
                                    y2="100" 
                                    stroke="#ef4444" 
                                    strokeWidth="1" 
                                    strokeDasharray="2,2" 
                                 />
                                 
                                 {/* Intersection Dot */}
                                 <circle 
                                    cx={10 + (Number(stats.yearsToScarcity) * 10)} 
                                    cy={getY(graphPoints[Math.floor(Number(stats.yearsToScarcity))].supply)} 
                                    r="3" fill="#ef4444" stroke="white" strokeWidth="1" className="animate-pulse" 
                                 />
                                 
                                 {/* Label */}
                                 <rect 
                                    x={10 + (Number(stats.yearsToScarcity) * 10) - 15} 
                                    y={getY(graphPoints[Math.floor(Number(stats.yearsToScarcity))].supply) - 12}
                                    width="30" height="8" rx="2" fill="#ef4444" opacity="0.9"
                                 />
                                 <text 
                                    x={10 + (Number(stats.yearsToScarcity) * 10)} 
                                    y={getY(graphPoints[Math.floor(Number(stats.yearsToScarcity))].supply) - 7}
                                    fill="white" fontSize="3" fontFamily="monospace" textAnchor="middle" fontWeight="bold"
                                 >
                                    KRİZ ANI
                                 </text>
                             </g>
                         )}
                     </svg>

                     {/* LEGEND OVERLAY */}
                     <div className="absolute bottom-6 left-6 flex items-center gap-4 text-[9px] font-mono text-gray-500 pointer-events-none">
                        <div className="flex items-center gap-1">
                           <div className="w-3 h-3 bg-indigo-500/10 border border-indigo-500/30 rounded-sm"></div>
                           <span>%95 Güven Aralığı</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <div className="w-3 h-0.5 bg-indigo-500 rounded-sm"></div>
                           <span>Beklenen Değer</span>
                        </div>
                     </div>
                </div>
            </div>

            {/* Results & AI Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Doomsday Clock Panel */}
                <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 backdrop-blur-md flex flex-col justify-center items-center relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-10 ${stats.yearsToScarcity === 'SAFE' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    
                    <h4 className="text-xs font-mono font-bold text-gray-400 mb-2 flex items-center gap-2">
                        <Clock size={14} /> KITLIK EŞİĞİNE KALAN
                    </h4>
                    <div className={`text-4xl font-bold font-mono tracking-widest ${stats.yearsToScarcity === 'SAFE' ? 'text-emerald-400' : 'text-red-500'}`}>
                        {stats.yearsToScarcity === 'SAFE' ? 'GÜVENLİ' : `${stats.yearsToScarcity} YIL`}
                    </div>
                    
                    <div className="mt-4 w-full flex justify-between text-xs font-mono border-t border-white/10 pt-3">
                         <div className="text-center">
                            <div className="text-gray-500">Tahmini Fatura</div>
                            <div className="text-white font-bold">₺{stats.projectedBill}</div>
                         </div>
                         <div className="text-center">
                            <div className="text-gray-500">Risk Skoru</div>
                            <div className={`${stats.scarcityRisk > 50 ? 'text-red-400' : 'text-emerald-400'} font-bold`}>%{stats.scarcityRisk}</div>
                         </div>
                    </div>
                </div>

                {/* AI Story Button */}
                <div className="flex flex-col gap-2">
                    <div className="flex-1 bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-lg">
                        <p className="text-xs text-indigo-200/80 leading-relaxed font-mono italic">
                           "Nüfus artışı %{params.populationGrowth} olmasına rağmen, AI benimsemesini %{params.aiAdoption} seviyesine çekmek krizi {stats.yearsToScarcity === 'SAFE' ? 'tamamen' : '2 yıl'} öteleyebilir."
                        </p>
                    </div>

                    <button 
                        onClick={() => onAnalyze(params, stats)}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-3 group border border-indigo-400/20"
                    >
                        <BrainCircuit size={20} className="text-white group-hover:rotate-12 transition-transform" />
                        <span className="font-mono font-bold text-sm tracking-widest">AI RİSK ANALİZİ BAŞLAT</span>
                        <AlertTriangle size={16} className={`${stats.scarcityRisk > 70 ? 'opacity-100 animate-bounce' : 'opacity-0'} text-amber-300`} />
                    </button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default SimulatorHub;