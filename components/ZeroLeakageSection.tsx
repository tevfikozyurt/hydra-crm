import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Target, Activity, DollarSign, MapPin, AlertOctagon, ScanLine, Droplet } from 'lucide-react';
import { ImpactStory } from '../types';
import { getBrandTheme } from '../theme';

interface ZeroLeakageSectionProps {
  timeFilter: string;
  onAnalyze: () => void;
  customStoryOverride?: ImpactStory | null;
}

const ZeroLeakageSection: React.FC<ZeroLeakageSectionProps> = ({ timeFilter, onAnalyze, customStoryOverride }) => {
  const [hoveredData, setHoveredData] = useState<{ low: number, medium: number, high: number, total: number, index: number } | null>(null);
  const [showHigh, setShowHigh] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = getBrandTheme();
  const [yScaleMode, setYScaleMode] = useState<'auto' | 'fixed'>('auto');
  const [customMaxY, setCustomMaxY] = useState<number | ''>('');
  const [tickCount, setTickCount] = useState(5);
  // Bölge seçici için state
  const [region, setRegion] = useState<string>('Tüm Bölgeler');
  // Bölge listesi
  const regionOptions = [
    'Tüm Bölgeler',
    'İstanbul',
    'Ankara',
    'İzmir',
    'Bursa'
  ];
  
  // Time range configuration
  const timeConfig = useMemo(() => {
    switch(timeFilter) {
      case '1H':
        return { points: 60, label: 'Son 1 Saat', unit: 'dk', format: (i: number) => `${i}dk` };
      case '24H':
        return { points: 24, label: 'Bugün', unit: 'saat', format: (i: number) => `${i}:00` };
      case '7D':
        return { points: 7, label: 'Son 7 Gün', unit: 'gün', format: (i: number) => `${i+1}. Gün` };
      case '30D':
        return { points: 30, label: 'Son 30 Gün', unit: 'gün', format: (i: number) => `${i+1}. Gün` };
      case 'Custom':
        return { points: 24, label: 'Özel Aralık', unit: 'saat', format: (i: number) => `${i}:00` };
      default:
        return { points: 24, label: 'Bugün', unit: 'saat', format: (i: number) => `${i}:00` };
    }
  }, [timeFilter]);

  // Advanced Mock Data Generation for Stacked Chart (Radar)
  const chartData = useMemo(() => {
    // Bölgeye göre mock varyasyon
    const regionFactor = {
      'Tüm Bölgeler': 1,
      'İstanbul': 1.2,
      'Ankara': 0.9,
      'İzmir': 1.05,
      'Bursa': 0.8
    };
    const factor = regionFactor[region] || 1;
    // Sensör mock verisi
    const sensorNames = {
      'Tüm Bölgeler': ['Genel_Sensör_1', 'Genel_Sensör_2', 'Genel_Sensör_3'],
      'İstanbul': ['Esenyurt_Sensör_8492', 'Kadıköy_Sensör_1123', 'Beşiktaş_Sensör_3344'],
      'Ankara': ['Çankaya_Sensör_2231', 'Keçiören_Sensör_5566', 'Yenimahalle_Sensör_7788'],
      'İzmir': ['Bornova_Sensör_9988', 'Karşıyaka_Sensör_7766', 'Konak_Sensör_5544'],
      'Bursa': ['Osmangazi_Sensör_4433', 'Nilüfer_Sensör_2211', 'Yıldırım_Sensör_6655']
    };
    return Array.from({ length: timeConfig.points }, (_, i) => {
       const position = i / (timeConfig.points - 1);
       const low = Math.floor((Math.random() * 8 + 5) * factor);
       const medium = Math.floor((Math.random() * 5 + 2) * factor);
       const high = position > 0.75 ? Math.floor((Math.random() * 10 + 5) * factor) : Math.floor((Math.random() * 3) * factor);
       // Sensör seçimi
       const sensors = sensorNames[region] || sensorNames['Tüm Bölgeler'];
       const sensorIdx = (i + region.length) % sensors.length;
       const sensorName = sensors[sensorIdx];
       const sensorId = 8000 + i * 13 + region.length;
       return {
         low,
         medium,
         high,
         total: low + medium + high,
         index: i,
         sensorName,
         sensorId
       };
    });
  }, [timeFilter, timeConfig.points, region]);

  const stats = useMemo(() => {
    // If hovering, use hovered data, else use total summary
    if (hoveredData) {
        const total = hoveredData.total;
        const highRisk = hoveredData.high;
        const highRiskPercent = Math.round((highRisk / total) * 100) || 0;
        const preventedLoss = (highRisk * 45000 * 0.85).toLocaleString('tr-TR');
        return { total, highRisk, highRiskPercent, preventedLoss, isLive: false };
    }

    // Default Summary
    const totalAnomalies = chartData.reduce((acc, curr) => acc + curr.total, 0);
    const highRiskCount = chartData.reduce((acc, curr) => acc + curr.high, 0);
    const highRiskPercent = Math.round((highRiskCount / totalAnomalies) * 100) || 0;
    
    // Financial Impact Logic
    const potentialLoss = (highRiskCount * 45000); // Mock cost per critical failure
    const preventedLoss = (potentialLoss * 0.85).toLocaleString('tr-TR');

    return { 
        total: totalAnomalies, 
        highRisk: highRiskCount, 
        highRiskPercent, 
        preventedLoss,
        isLive: true
    };
  }, [chartData, hoveredData]);

  // Determine display content based on standard or override
  const storyTitle = customStoryOverride?.title || "KRİZ ÖNLEME RADARI";
  // Updated Narrative as requested
  const storyMessage = customStoryOverride?.message || `Tespit edilen anomalilerin %${stats.highRiskPercent}'i yüksek riskli (KIRMIZI) kategoridedir. AI, bu kritik sızıntıları önleyerek, toplam tahmini aylık kayıp maliyetinin %85'ini (yaklaşık ₺${stats.preventedLoss}) tek başına durdurmuştur.`;
  
  const autoMaxY = useMemo(() => {
    const m = Math.max(...chartData.map(d => d.total));
    const rounded = Math.ceil(m / 5) * 5; // Round up to multiple of 5
    return Math.max(20, rounded);
  }, [chartData]);
  const maxY = yScaleMode === 'auto' ? autoMaxY : (typeof customMaxY === 'number' && customMaxY > 0 ? customMaxY : autoMaxY);

  // Interaction Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const index = Math.min(timeConfig.points - 1, Math.max(0, Math.floor((x / width) * timeConfig.points)));
    setHoveredData(chartData[index]);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const downloadChartPng = async () => {
    if (!chartRef.current || !svgRef.current) return;
    const svg = svgRef.current;
    const rect = chartRef.current.getBoundingClientRect();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    await new Promise(resolve => { img.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(rect.width));
    canvas.height = Math.max(1, Math.floor(rect.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.download = 'kriz-radari.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="w-full bg-slate-900/60 border border-cyan-500/20 rounded-xl backdrop-blur-md overflow-hidden relative group shadow-2xl">
      {/* Decorative Header Bar & Scanline */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
      
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: CRISIS RADAR (Stacked Area Chart) */}
        <div className="lg:col-span-6 flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded border transition-colors duration-300 ${stats.isLive ? 'bg-red-500/10 border-red-500/50' : 'bg-cyan-500/10 border-cyan-500/50'}`}> 
                    <Activity className={stats.isLive ? "text-red-500" : "text-cyan-500"} size={16} />
                </div>
                <div className="flex items-center justify-between w-full gap-2">
                  <h3 className="text-sm font-mono font-bold text-gray-200 tracking-wider">
                      {stats.isLive ? "CANLI ANOMALİ RADARI" : `ANLIK DETAY: ${hoveredData ? timeConfig.format(hoveredData.index) : ''}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      className="bg-slate-800/60 border border-cyan-400/30 text-cyan-200 text-xs font-mono rounded-lg px-2 py-1 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500/40 backdrop-blur-md"
                      style={{ minWidth: 120 }}
                    >
                      {regionOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-[10px] font-bold font-mono shadow border border-red-500/40 align-middle">
                      Risk Skoru: {
                        (() => {
                          let score = 7;
                          if (region === 'İstanbul') score = Math.min(10, Math.max(1, Math.round(stats.highRisk * 1.2 / 10)));
                          else if (region === 'Ankara') score = Math.min(10, Math.max(1, Math.round(stats.highRisk * 0.8 / 10)));
                          else if (region === 'İzmir') score = Math.min(10, Math.max(1, Math.round(stats.highRisk * 1.1 / 10)));
                          else if (region === 'Bursa') score = Math.min(10, Math.max(1, Math.round(stats.highRisk * 0.7 / 10)));
                          else score = Math.min(10, Math.max(1, Math.round(stats.highRisk / 10)));
                          return `${score}/10`;
                        })()
                      }
                    </span>
                  </div>
                </div>
            </div>
            <div className="flex gap-3 text-[9px] font-mono items-center">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="accent-red-500" checked={showHigh} onChange={(e)=>setShowHigh(e.target.checked)} />
                  <div className="w-2 h-2 rounded-full bg-red-500"/> KRİTİK
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" checked={showMedium} onChange={(e)=>setShowMedium(e.target.checked)} />
                  <div className="w-2 h-2 rounded-full bg-amber-500"/> UYARI
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="accent-cyan-600" checked={showLow} onChange={(e)=>setShowLow(e.target.checked)} />
                  <div className="w-2 h-2 rounded-full bg-cyan-900"/> NORMAL
                </label>
                <button onClick={downloadChartPng} className="ml-2 px-2 py-1 border border-white/10 rounded hover:border-white/30 text-[9px] text-gray-300">
                  PNG indir
                </button>
                <div className="ml-2 flex items-center gap-2">
                  <select value={yScaleMode} onChange={(e)=>setYScaleMode(e.target.value as 'auto'|'fixed')} className="bg-slate-950/80 border border-white/10 text-gray-200 text-[9px] rounded px-2 py-1">
                    <option value="auto">Otomatik ölçek</option>
                    <option value="fixed">Sabit ölçek</option>
                  </select>
                  {yScaleMode === 'fixed' && (
                    <input type="number" min={1} max={200} value={customMaxY === '' ? '' : customMaxY} onChange={(e)=>setCustomMaxY(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Max Y" className="w-16 bg-slate-950/80 border border-white/10 text-gray-200 text-[9px] rounded px-2 py-1" />
                  )}
                  <select value={tickCount} onChange={(e)=>setTickCount(Number(e.target.value))} className="bg-slate-950/80 border border-white/10 text-gray-200 text-[9px] rounded px-2 py-1">
                    {[4,5,6,8].map(n=> (<option key={n} value={n}>{n} tick</option>))}
                  </select>
                </div>
            </div>
          </div>
          
          <div 
            ref={chartRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="h-40 w-full relative border border-white/10 bg-black/40 rounded-lg overflow-hidden cursor-crosshair"
          >
             
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Radar Scanner Animation (Only when not hovering) */}
            {!hoveredData && (
                <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent absolute top-0 animate-[scanline_3s_linear_infinite]" />
                </div>
            )}

            {/* Hover Scanner Line (Follows Mouse) */}
            {hoveredData && (
                 <div 
                    className="absolute top-0 h-full w-[1px] bg-white/50 z-20 pointer-events-none" 
                    style={{ left: `${(hoveredData.index / (timeConfig.points - 1)) * 100}%` }}
                 >
                     <div className="absolute top-0 -translate-x-1/2 w-2 h-full bg-white/5 blur-[1px]" />
                 </div>
            )}

            {/* SVG Chart */}
            <svg ref={svgRef} role="img" aria-label="Kriz Önleme Radar grafiği" className="w-full h-full overflow-visible relative z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={theme.colors.critical} stopOpacity="0.8" />
                   <stop offset="100%" stopColor={theme.colors.critical} stopOpacity="0.1" />
                 </linearGradient>
                 <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={theme.colors.warning} stopOpacity="0.6" />
                   <stop offset="100%" stopColor={theme.colors.warning} stopOpacity="0.1" />
                 </linearGradient>
                 <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#083344" stopOpacity="0.8" />
                   <stop offset="100%" stopColor={theme.colors.normal} stopOpacity="0.1" />
                 </linearGradient>
               </defs>

               {/* Y-Axis Ticks & Labels */}
               {Array.from({length: tickCount}, (_,i)=> i).map(i => {
                 const val = (i * maxY) / (tickCount - 1);
                 const y = 100 - (val / maxY) * 100;
                 return (
                   <g key={i}>
                     <line x1="0" y1={y} x2="100" y2={y} stroke={theme.colors.grid} strokeWidth="0.5" />
                     <text x="1" y={y - 1} fontSize="3" fill="#64748b" fontFamily="monospace">{Math.round(val)}</text>
                   </g>
                 );
               })}

               {/* X-Axis Ticks */}
               {(() => {
                 const tickPositions = timeConfig.points <= 24 
                   ? [0, Math.floor(timeConfig.points/4), Math.floor(timeConfig.points/2), Math.floor(3*timeConfig.points/4), timeConfig.points]
                   : [0, 7, 14, 21, timeConfig.points];
                 return tickPositions.map(idx => (
                   <g key={idx}>
                     <line x1={(idx/timeConfig.points)*100} y1="0" x2={(idx/timeConfig.points)*100} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                     <text x={(idx/timeConfig.points)*100} y="99" fontSize="3" fill="#64748b" fontFamily="monospace" textAnchor="middle">{idx < timeConfig.points ? idx : timeConfig.points}</text>
                   </g>
                 ));
               })()}

               {/* LAYER 1: RED (Total Height) */}
               {showHigh && (
                 <path
                   d={`M 0,100 ` + chartData.map((d, i) => `L ${((i) / (chartData.length - 1)) * 100},${100 - ((d.total / maxY) * 100)}`).join(' ') + ` L 100,100 Z`}
                   fill="url(#gradRed)"
                   stroke={theme.colors.critical}
                   strokeWidth="0.5"
                 />
               )}

               {/* LAYER 2: AMBER (Medium + Low) */}
               {showMedium && (
                 <path
                   d={`M 0,100 ` + chartData.map((d, i) => `L ${((i) / (chartData.length - 1)) * 100},${100 - (((d.medium + d.low) / maxY) * 100)}`).join(' ') + ` L 100,100 Z`}
                   fill="url(#gradAmber)"
                   stroke={theme.colors.warning}
                   strokeWidth="0.5"
                 />
               )}

               {/* LAYER 3: BLUE (Low) */}
               {showLow && (
                 <path
                   d={`M 0,100 ` + chartData.map((d, i) => `L ${((i) / (chartData.length - 1)) * 100},${100 - ((d.low / maxY) * 100)}`).join(' ') + ` L 100,100 Z`}
                   fill="url(#gradBlue)"
                 />
               )}

               {/* Live Pulse Point (At the tip of the Red/High graph) */}
              {!hoveredData && showHigh && (
                <g>
                   <circle 
                      cx="100" 
                      cy={100 - ((chartData[chartData.length-1].total / maxY) * 100)} 
                      r="1.5" 
                      fill="#fff"
                   />
                   <circle 
                      cx="100" 
                      cy={100 - ((chartData[chartData.length-1].total / maxY) * 100)} 
                      r="4" 
                      fill="none"
                       stroke={theme.colors.critical}
                      strokeWidth="0.5"
                      className="animate-ping"
                   />
                </g>
               )}
            </svg>

            {/* TOOLTIP OVERLAY (Glassmorphism) */}
            <AnimatePresence>
                {hoveredData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 pointer-events-none bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl min-w-[180px]"
                    style={{
                      left: hoveredData.index > timeConfig.points/2 ? 'auto' : `${(hoveredData.index / (timeConfig.points - 1)) * 100 + 2}%`,
                      right: hoveredData.index > timeConfig.points/2 ? `${100 - ((hoveredData.index / (timeConfig.points - 1)) * 100) + 2}%` : 'auto',
                      top: '10%'
                    }}
                  >
                    <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                      <span className="text-xs font-mono font-bold text-white">{timeConfig.format(hoveredData.index)}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{region}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-red-400">Kritik Sızıntı:</span>
                        <span className="text-red-400 font-bold">{hoveredData.high}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-amber-400">Uyarı Seviyesi:</span>
                        <span className="text-amber-400 font-bold">%{Math.round(hoveredData.medium/hoveredData.total*100)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Hata Kaynağı:</span>
                        <span className="text-cyan-400 font-bold">{hoveredData.sensorName} #{hoveredData.sensorId}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Toplam:</span>
                        <span className="text-white font-bold">{hoveredData.total}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-cyan-400">Normal:</span>
                        <span className="text-cyan-400 font-bold">{hoveredData.low} (%{Math.round(hoveredData.low/hoveredData.total*100)})</span>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

          </div>

          {/* High Risk Metric Below Chart (Dynamic) */}
          <div className={`flex items-center justify-between mt-3 border rounded p-2 px-3 transition-colors duration-300 ${stats.isLive ? 'bg-red-950/20 border-red-500/20' : 'bg-cyan-950/20 border-cyan-500/20'}`}>
             <span className={`text-xs font-mono ${stats.isLive ? 'text-red-200' : 'text-cyan-200'}`}>
                 {stats.isLive ? "Yüksek Riskli Anomali:" : "Seçili Saat Riski:"}
             </span>
             <div className="flex items-baseline gap-2">
                <span className={`text-lg font-bold font-mono ${stats.isLive ? 'text-red-500' : 'text-cyan-400'}`}>{stats.highRisk} Adet</span>
                <span className={`text-xs font-mono opacity-70 ${stats.isLive ? 'text-red-400' : 'text-cyan-300'}`}>({stats.highRiskPercent}%)</span>
             </div>
          </div>
        </div>

        {/* MIDDLE: Anomaly Type (Doughnut) - Simplified Visual */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center border-y lg:border-y-0 lg:border-x border-white/5 py-4 lg:py-0 px-2">
          
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="4" />
              {/* High Risk Segment */}
              <motion.path 
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${stats.highRiskPercent}, 100` }}
                transition={{ duration: 0.5 }} // Faster transition for hover responsiveness
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" stroke={stats.isLive ? "#ef4444" : "#06b6d4"} strokeWidth="4" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <AlertOctagon size={20} className={stats.isLive ? "text-red-500 mb-1" : "text-cyan-500 mb-1"} />
               <span className="text-[9px] text-gray-400 font-mono">Kritik</span>
            </div>
          </div>
          
          <div className="text-center">
              <div className="text-2xl font-bold font-mono text-white">{stats.total}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest">Toplam Olay</div>
          </div>
        </div>

        {/* RIGHT: Storytelling & Action */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full">
           <div>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-mono font-bold text-white tracking-wider flex items-center gap-2">
                    <Target className={customStoryOverride?.icon === 'bottle' ? "text-cyan-400" : "text-red-500 animate-pulse"} size={16} /> 
                    {storyTitle}
                 </h3>
              </div>
              
              {/* Dynamic Story Block */}
              <div className={`p-4 rounded-lg border-l-2 relative overflow-hidden flex flex-col gap-3 ${
                  customStoryOverride?.icon === 'bottle' 
                    ? 'bg-gradient-to-br from-slate-900 to-cyan-950/20 border-cyan-500' 
                    : 'bg-gradient-to-br from-slate-900 to-red-950/20 border-red-500'
              }`}>
                  
                  {/* BOTTLE VISUALIZATION LOGIC */}
                  {/* Bölgeye göre damacana katsayısı ve görselleştirme */}
                  {(() => {
                    const damacanaFactors = {
                      'Tüm Bölgeler': 1,
                      'İstanbul': 1.3,
                      'Ankara': 0.8,
                      'İzmir': 1.1,
                      'Bursa': 0.7
                    };
                    const damacanaFactor = damacanaFactors[region] || 1;
                    const damacanaCount = Math.max(1, Math.round(stats.highRisk * damacanaFactor));
                    const damacanaText = `${region} bölgesinde tespit edilen kritik sızıntıların eşdeğeri: ${damacanaCount} adet damacana içme suyu.`;
                    return (
                      <div className="p-4 rounded-lg border-l-2 relative overflow-hidden flex flex-col gap-y-4 bg-gradient-to-br from-slate-900 to-cyan-950/20 border-cyan-500 overflow-hidden">
                        <div className="flex flex-col gap-y-4">
                          <div className="max-h-[120px] overflow-y-auto flex flex-wrap gap-1 p-2 bg-slate-950/50 rounded-lg border border-cyan-500/20 justify-center">
                            {Array.from({ length: Math.min(40, damacanaCount) }).map((_, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, scale: 0 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                              >
                                <Droplet size={12} className="text-cyan-400 fill-cyan-400/50" />
                              </motion.div>
                            ))}
                          </div>
                          <div className="text-center font-mono text-4xl font-bold text-cyan-400 tracking-wider">
                            {damacanaCount}
                          </div>
                          <p className="text-xs text-cyan-200 leading-relaxed relative z-10 font-sans">
                            {damacanaText}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {!customStoryOverride?.icon && (
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                          <DollarSign size={40} className="text-white" />
                      </div>
                  )}

                  <p className="text-xs text-gray-300 leading-relaxed relative z-10 font-sans">
                     {storyMessage}
                  </p>
              </div>
           </div>

           <button 
              onClick={onAnalyze}
              className={`mt-4 w-full group relative flex items-center justify-center gap-3 py-4 px-4 rounded-lg transition-all overflow-hidden border ${
                 customStoryOverride?.icon === 'bottle' 
                    ? 'bg-cyan-900/40 hover:bg-cyan-800/40 border-cyan-500/30 hover:border-cyan-500/60'
                    : 'bg-red-900/40 hover:bg-red-800/40 border-red-500/30 hover:border-red-500/60'
              }`}
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <BrainCircuit size={18} className={`group-hover:rotate-90 transition-transform duration-500 ${customStoryOverride?.icon === 'bottle' ? 'text-cyan-300' : 'text-red-300'}`} />
              <span className={`font-mono font-bold text-xs tracking-widest z-10 ${customStoryOverride?.icon === 'bottle' ? 'text-cyan-100' : 'text-red-100'}`}>
                  {customStoryOverride?.icon === 'bottle' ? 'AI ANALİZ: DETAYLI RAPOR' : 'AI MÜDAHALE: EKİP YÖNLENDİR'}
              </span>
           </button>
        </div>

      </div>
    </div>
  );
};

export default ZeroLeakageSection;