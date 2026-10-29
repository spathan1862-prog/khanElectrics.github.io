import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';
  const isInfo = toast.type === 'info';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md transition-all duration-300">
      <div
        className={`px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
          isError
            ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-500/30'
            : isSuccess
            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
            : isInfo
            ? 'bg-blue-950/90 border-blue-400 text-blue-200 shadow-blue-500/20'
            : 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-amber-500/20'
        }`}
      >
        {isError && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
        <span className="leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
