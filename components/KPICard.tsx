import React from 'react';
import { KPI } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  data: KPI;
  delay: number;
}

const KPICard: React.FC<KPICardProps> = ({ data, delay }) => {
  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'critical': return 'text-hydra-alert drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'warning': return 'text-hydra-warn drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      default: return 'text-hydra-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]';
    }
  };

  const getBorderColor = (status: KPI['status']) => {
    switch (status) {
      case 'critical': return 'border-hydra-alert/30 bg-red-950/10';
      case 'warning': return 'border-hydra-warn/30 bg-amber-950/10';
      default: return 'border-hydra-cyan/20 bg-cyan-950/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative p-5 backdrop-blur-md rounded-xl border ${getBorderColor(data.status)} flex flex-col justify-between h-36 overflow-hidden group hover:bg-white/5 transition-colors`}
    >
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider">{data.label}</h3>
        <div className={`flex items-center gap-1 text-xs font-mono ${
          data.trend === 'up' && data.status === 'critical' ? 'text-red-400' :
          data.trend === 'down' && data.status !== 'critical' ? 'text-green-400' : 'text-gray-400'
        }`}>
          {data.trend === 'up' ? <TrendingUp size={14} /> : data.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
          <span>{data.trendValue}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="z-10 mt-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold font-mono ${getStatusColor(data.status)}`}>
            {data.value}
          </span>
          <span className="text-gray-500 text-xs font-mono">{data.unit}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 truncate">{data.description}</p>
      </div>

      {/* Animated Background Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
         <motion.div 
            className={`h-full ${data.status === 'critical' ? 'bg-red-500' : 'bg-cyan-500'}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear"
            }}
         />
      </div>

      {/* Scanline decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </motion.div>
  );
};

export default KPICard;