import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 text-sm font-medium ${
        toast.type === 'success' 
          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
          : toast.type === 'info'
          ? 'bg-blue-950/80 border-blue-400 text-blue-200 shadow-blue-500/20'
          : 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-amber-500/20'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
