import React from 'react';
import { Anomaly } from '../types';
import { AlertTriangle, ShieldAlert, Info, Activity } from 'lucide-react';

interface TickerProps {
  anomalies: Anomaly[];
}

const Ticker: React.FC<TickerProps> = ({ anomalies }) => {
  
  // Helper to determine styling based on severity (color coding)
  const getSeverityStyles = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'high': // CRITICAL (RED) - Pipe Burst/Leak
        return {
          icon: <ShieldAlert size={14} className="animate-pulse" />,
          color: 'text-red-500',
          bg: 'bg-red-500',
          border: 'border-red-500/30',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]'
        };
      case 'medium': // WARNING (YELLOW) - Consumption Spike
        return {
          icon: <AlertTriangle size={14} />,
          color: 'text-amber-500',
          bg: 'bg-amber-500',
          border: 'border-amber-500/30',
          glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]'
        };
      default: // INFO (BLUE) - Sensor Error
        return {
          icon: <Info size={14} />,
          color: 'text-blue-500',
          bg: 'bg-blue-500',
          border: 'border-blue-500/30',
          glow: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]'
        };
    }
  };

  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 h-10 flex items-center relative z-40 shadow-2xl">
      
      {/* Label Section - Fixed and Opaque */}
      <div className="bg-red-950 h-full px-4 flex items-center justify-center border-r border-red-500/50 z-30 shadow-[0_0_20px_rgba(239,68,68,0.4)] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <span className="text-red-500 font-bold font-mono text-sm tracking-widest animate-pulse flex items-center gap-2 relative z-10">
          <Activity size={14} />
          OPERASYONEL ÖNCELİK
        </span>
        {/* Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
      </div>
      
      {/* Marquee Wrapper */}
      <div className="flex-1 overflow-hidden h-full relative bg-slate-900/50 flex items-center">
        
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
        
        {/* Scrolling Content */}
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] items-center absolute left-0 will-change-transform">
          
          {/* Loop over anomalies twice for smooth infinite scroll */}
          {[...anomalies, ...anomalies].map((a, i) => {
            const style = getSeverityStyles(a.severity);
            return (
              <div key={`${a.id}-${i}`} className="flex items-center gap-4 mr-12 text-sm font-mono group border-r border-white/5 pr-12 last:border-0">
                
                {/* 1. Status Indicator */}
                <div className={`flex items-center gap-2 ${style.color}`}>
                  {style.icon}
                  <span className="font-bold tracking-wide">{a.location}</span>
                </div>

                {/* 2. Timestamp */}
                <span className="text-slate-500 font-bold text-xs">[{a.timestamp}]</span>

                {/* 3. Description & Value */}
                <div className="flex items-center gap-2 text-slate-300">
                   <span>{a.type}</span>
                   <span className={`px-1.5 py-0.5 rounded text-xs bg-slate-800 ${style.color} border ${style.border}`}>
                      {a.value}
                   </span>
                </div>

                {/* 4. AI Risk Score (HUD Element) */}
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                   <span className="text-[10px] text-gray-500 uppercase tracking-wider">RISK SKORU</span>
                   <div className={`flex items-center justify-center px-2 py-0.5 rounded border bg-slate-950 ${style.border} ${style.color} font-bold ${style.glow}`}>
                      {a.riskScore}/10
                   </div>
                </div>

              </div>
            );
          })}

        </div>

        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Ticker;