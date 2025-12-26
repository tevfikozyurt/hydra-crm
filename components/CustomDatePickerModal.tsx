import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface CustomDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (start: string, end: string) => void;
}

const CustomDatePickerModal: React.FC<CustomDatePickerModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 to-cyan-950/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                   <Calendar className="text-cyan-400" size={20} />
                </div>
                <div>
                   <h3 className="text-white font-mono font-bold tracking-wide">ZAMANSAL FİLTRE</h3>
                   <p className="text-[10px] text-cyan-300/60 font-mono uppercase">Özel Tarih Aralığı Belirle</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col gap-6">
               
               {/* Date Inputs Container */}
               <div className="flex items-center gap-4">
                  {/* Start Date */}
                  <div className="flex-1 space-y-2 group">
                     <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                        Başlangıç
                     </label>
                     <div className="relative">
                        <input 
                           type="date" 
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors color-scheme-dark"
                        />
                        <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-500/0 group-focus-within:border-cyan-500/50 group-focus-within:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all" />
                     </div>
                  </div>

                  {/* Arrow Divider */}
                  <div className="pt-6 text-gray-600">
                     <ArrowRight size={20} />
                  </div>

                  {/* End Date */}
                  <div className="flex-1 space-y-2 group">
                     <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                        Bitiş
                     </label>
                     <div className="relative">
                        <input 
                           type="date" 
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors color-scheme-dark"
                        />
                        <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-500/0 group-focus-within:border-cyan-500/50 group-focus-within:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all" />
                     </div>
                  </div>
               </div>

               {/* Info/Warning Area */}
               <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3 flex gap-3 items-start">
                  <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-cyan-200/70 font-mono leading-relaxed">
                     Seçilen aralık için AI motoru geçmiş verileri tarayacak ve özel bir <span className="text-white font-bold">sızıntı & tüketim hikayesi</span> oluşturacaktır.
                  </p>
               </div>

            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
               <button 
                  onClick={handleConfirm}
                  disabled={!startDate || !endDate}
                  className={`w-full py-4 rounded-xl font-mono font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-2
                     ${startDate && endDate 
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]' 
                        : 'bg-slate-800 text-gray-500 cursor-not-allowed'}
                  `}
               >
                  <span>ANALİZİ BAŞLAT</span>
                  <ArrowRight size={16} className={startDate && endDate ? 'animate-pulse' : ''} />
               </button>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-cyan-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomDatePickerModal;