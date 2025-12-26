import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAnalysisResult } from '../types';
import { X, ShieldAlert, CheckCircle2, MapPin, TrendingUp, Lightbulb, Stethoscope, Briefcase, BrainCircuit } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AIAnalysisResult | null;
  loading: boolean;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, data, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-slate-950 border border-hydra-cyan/30 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/50 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                   {loading ? (
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                   ) : (
                      <Briefcase className="text-cyan-400" size={24} />
                   )}
                </div>
                <div>
                    <h2 className="text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                       HYDRA <span className="text-cyan-400">DANIŞMANI</span>
                    </h2>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-mono">Stratejik Karar Destek Sistemi</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto font-sans">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-6">
                  <div className="relative">
                     <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit size={32} className="text-cyan-500/50 animate-pulse" />
                     </div>
                  </div>
                  <div className="text-center">
                     <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">VERİLER ANALİZ EDİLİYOR...</p>
                     <p className="text-gray-500 text-xs mt-2">Gemini 2.5 Flash • Strateji Motoru • Gerçek Zamanlı</p>
                  </div>
                </div>
              ) : data ? (
                <div className="space-y-6">
                  
                  {/* SECTION 1: DIAGNOSIS (TEŞHİS) */}
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Stethoscope size={14} className="text-gray-400" /> DURUM TEŞHİSİ (Diagnosis)
                     </h3>
                     <div className={`p-4 rounded-xl border flex items-start gap-4 ${
                        data.riskLevel === 'CRITICAL' ? 'bg-red-950/20 border-red-500/30' : 
                        data.riskLevel === 'HIGH' ? 'bg-amber-950/20 border-amber-500/30' :
                        'bg-slate-900 border-white/10'
                     }`}>
                        <div className={`mt-1 p-2 rounded-lg ${
                           data.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                           data.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                           'bg-cyan-500/20 text-cyan-400'
                        }`}>
                           <ShieldAlert size={20} />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-bold font-mono ${
                                 data.riskLevel === 'CRITICAL' ? 'text-red-400' : 
                                 data.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-gray-300'
                              }`}>
                                 {data.riskLevel === 'CRITICAL' ? 'KRİTİK RİSK TESPİTİ' : 'OPERASYONEL TESPİT'}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                                 <MapPin size={10} /> {data.priorityRegion}
                              </div>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed">{data.summary}</p>
                        </div>
                     </div>
                  </div>

                  {/* SECTION 2: PRESCRIPTION (REÇETE/AKSİYON) */}
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Lightbulb size={14} className="text-amber-500" /> STRATEJİK AKSİYON PLANI
                     </h3>
                     <div className="grid gap-2">
                        {data.actionItems.map((item, idx) => (
                           <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all cursor-default"
                           >
                              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0">
                                 <span className="text-xs font-mono font-bold text-cyan-500 group-hover:text-black">{idx + 1}</span>
                              </div>
                              <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{item}</span>
                              <CheckCircle2 size={16} className="ml-auto text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                           </motion.div>
                        ))}
                     </div>
                  </div>

                  {/* SECTION 3: PROGNOSIS (BEKLENEN SONUÇ) */}
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" /> BEKLENEN ETKİ / SONUÇ
                     </h3>
                     <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-4 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <TrendingUp size={60} className="text-emerald-500" />
                        </div>
                        <p className="text-emerald-100/90 text-sm font-medium relative z-10 leading-relaxed">
                           "{data.projectedImpact}"
                        </p>
                     </div>
                  </div>

                </div>
              ) : (
                <div className="text-center text-red-500 py-10">Analiz Başarısız. Lütfen tekrar deneyin.</div>
              )}
            </div>
            
            {/* Footer decoration */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-amber-600" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIModal;